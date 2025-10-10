<?php

namespace App\Http\Controllers\Api;

use App\Models\AccesoComputoExterno;
use App\Models\Observadores;
use App\Models\AccesoComputoObservadores;
use App\Http\Requests\ActivarAccesoComputoExternoRequest;
use App\Http\Requests\ActualizarObservadorRequest;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Milon\Barcode\Facades\DNS1DFacade as DNS1D;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\DB;
use Psy\Command\WhereamiCommand;

class AccesoComputoExternoController extends Controller
{
    public function generateQRExterno($type)
    {
        if (!in_array($type, ['prensa', 'observador', 'candidato', 'delegado', 'publico'])) {
            return response()->json(['msg' => 'Tipo inválido'], 400);
        }

        $code = Str::upper(Str::random(10));
        $qrData = "/externo-{$code}";
        $qr = QrCode::format('svg')->size(pixels: 250)->generate($qrData);

        $codigoBarra = DNS1D::getBarcodeSVG($qrData, 'C128', 2, 70, false);

        $fileName = 'qr_' . $code . '.svg';
        $fileNameBC = 'bc_' . $code . '.svg';

        Storage::put("public/qr/{$fileName}", $qr);
        Storage::put("public/barcode/{$fileNameBC}", $codigoBarra);

        $accessCode = AccesoComputoExterno::create([
            'token_acceso' => $code,
            'tipo' => $type,
            'activo' => true,
            'qr' => $qr,
            'barcode' => $codigoBarra
        ]);

        $resultados[] = [
            'res' => true,
            'msg' => 'QR generado y guardado',
            'code' => $code,
        ];

        return response()->json([
            'res' => true,
            'datos' => $resultados
        ]);
    }

    public function verify($code)
    {
        $accessCode = AccesoComputoExterno::where('token_acceso', $code)
            ->where('activo', true)
            ->first();

        if ($accessCode) {
            return response()->json([
                'res' => true,
                'msg' => 'Acceso permitido',
                'type' => $accessCode->tipo,
                'status' => 200
            ]);
        }

        return response()->json([
            'res' => false,
            'msg' => 'Acceso denegado',
            'status' => 403
        ]);
    }

    public function generateQRExternoMasivo(Request $request)
    {
        $request->validate([
            'tipo' => 'required|in:prensa,observador,candidato,delegado,publico',
            'cantidad' => 'required|integer|min:1|max:1000'
        ]);

        $type = $request->input('tipo');
        $cantidad = $request->input('cantidad');
        $resultados = [];

        for ($i = 0; $i < $cantidad; $i++) {
            $code = Str::upper(Str::random(5));
            $qrData = "externo-{$code}";

            $qr = QrCode::format('svg')->size(250)->generate($qrData);
            $codigoBarra = DNS1D::getBarcodeSVG($qrData, 'C128', 2, 70, false);

            $fileNameQR = "qr_{$code}.svg";
            $fileNameBC = "bc_{$code}.svg";

            Storage::put("public/qr/{$fileNameQR}", $qr);
            Storage::put("public/barcode/{$fileNameBC}", $codigoBarra);

            AccesoComputoExterno::create([
                'token_acceso' => $code,
                'tipo' => $type,
                'qr' => $qr,
                'barcode' => $codigoBarra,
                'activo' => false,
            ]);

            $resultados[] = [
                'token_acceso' => $code,
                'tipo' => $type,
                'qr' => $qr ? base64_encode($qr) : null,
                'barcode' => $codigoBarra ? base64_encode($codigoBarra) : null,
            ];
        }

        return response()->json([
            'res' => true,
            'msg' => "Se generaron {$cantidad} accesos",
            'datos' => $resultados
        ]);
    }

    public function listarAccesosExternos(Request $request)
    {
        $request->validate([
            'cantidad' => 'nullable|integer|min:1|max:500',
            'tipo' => 'nullable|in:candidato,delegado,prensa,observador,publico',
            'activo' => 'nullable|boolean',
            'tokens.*' => 'string',
        ]);

        $accesos = DB::table('acceso_computo_externo as a')
            ->select(
                'a.id',
                'a.token_acceso',
                'a.tipo',
                'a.activo',
                'a.qr',
                'a.barcode',
                'a.created_at',
                'a.updated_at'
            )
            ->when($request->filled('tipo'), function ($query) use ($request) {
                $query->where('a.tipo', $request->input('tipo'));
            })
            ->when($request->filled('activo'), function ($query) use ($request) {
                $query->where('a.activo', $request->input('activo'));
            })
            ->when($request->filled('tokens'), function ($query) use ($request) {
                $query->whereIn('a.token_acceso', $request->input('tokens'));
            })
            ->when($request->filled('cantidad'), function ($query) use ($request) {
                $query->limit($request->input('cantidad'));
            })
            ->orderBy('a.created_at', 'desc')
            ->get();

        $accesosArray = $accesos->map(function ($acceso) {
            $arrayAcceso = (array) $acceso;
            // $arrayAcceso['foto'] = $acceso->foto ? base64_encode($acceso->foto) : null;
            $arrayAcceso['qr'] = $acceso->qr ? base64_encode($acceso->qr) : null;
            $arrayAcceso['barcode'] = $acceso->barcode ? base64_encode($acceso->barcode) : null;
            return $arrayAcceso;
        });
        return response()->json([
            'res' => true,
            'datos' => $accesosArray
        ]);
    }

    public function activarAccesoComputoExterno(ActivarAccesoComputoExternoRequest $request, $token)
    {
        // Buscar token
        $token = AccesoComputoExterno::where('token_acceso', $token)->firstOrFail();

        if ($token->activo) {
            return response()->json([
                'res' => false,
                'msg' => 'El token ya fue activado previamente.',
                'status' => 400,
            ], 400);
        }

        $validated = $request->validated();
        $ci = $validated['ci'] ?? null;

        // Buscar o crear observador
        $observador = $ci ? Observadores::where('ci', $ci)->first() : null;

        if ($observador) {
            // Liberar asignación activa previa si existe
            $asignacionActiva = AccesoComputoObservadores::where('observador_id', $observador->id)
                ->whereNull('liberado')
                ->first();

            if ($asignacionActiva) {
                // Desactivar token anterior y liberar observador
                AccesoComputoExterno::where('id', $asignacionActiva->token_id)->update(['activo' => 0]);
                $asignacionActiva->update(['liberado' => now()]);
            }

            // Actualizar datos del observador existente
            $observador->fill([
                'nombre_completo' => $validated['nombre_completo'] ?? $observador->nombre_completo,
                'ci' => $ci,
                'identificador' => $validated['identificador'] ?? null,
                'organizacion_politica' => $validated['organizacion_politica'] ?? null,
            ]);
        } else {
            // Crear nuevo observador
            $observador = new Observadores([
                'nombre_completo' => $validated['nombre_completo'],
                'ci' => $ci,
                'identificador' => $validated['identificador'] ?? null,
                'organizacion_politica' => $validated['organizacion_politica'] ?? null,
            ]);
        }

        // Procesar foto (solo si hay una nueva)
        if ($request->hasFile('foto')) {
            $observador->foto = $this->procesarFoto($request->file('foto'));
        }

        $observador->save();

        // Registrar asignación
        $asignacion = AccesoComputoObservadores::create([
            'token_id' => $token->id,
            'observador_id' => $observador->id,
            'asignado' => now(),
            'liberado' => null,
        ]);

        // Activar token
        $token->update(['activo' => 1]);

        // Respuesta
        return response()->json([
            'res' => true,
            'msg' => $ci
                ? 'Observador registrado o actualizado y token asignado correctamente'
                : 'Observador sin CI registrado y token asignado correctamente',
            'status' => 200,
            'observador' => $observador->makeHidden(['foto'])->toArray() + [
                'foto' => $observador->foto ? base64_encode($observador->foto) : null,
            ],
            'asignacion' => $asignacion,
        ]);
    }

    public function updateObservador(ActualizarObservadorRequest $request, $token)
    {
        try {

            $tokenModel = AccesoComputoExterno::where('token_acceso', $token)->first();
            if (!$tokenModel) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Token no encontrado',
                    'status' => 404,
                ], 404);
            }

            $validated = $request->validated();

            //Si el CI fue proporcionado, verificar si ya existe en otro observador
            if (isset($validated['ci'])) {
                $observadorExistente = Observadores::where('ci', $validated['ci'])->first();
                if ($observadorExistente && $observadorExistente->id != $validated['id']) {
                    return response()->json([
                        'res' => false,
                        'msg' => 'La cédula de identidad ya está en uso por otro observador.',
                        'status' => 400,
                    ], 400);
                }
            }

            // Verificar si el observador está asignado al token y no ha sido liberado
            $asignacion = AccesoComputoObservadores::where('token_id', $tokenModel->id)
                ->where('observador_id', $validated['id'])
                ->whereNull('liberado')
                ->first();
            // Si fue liberado o no existe, retornar error
            if (!$asignacion) {
                return response()->json([
                    'res' => false,
                    'msg' => 'No hay un observador asignado a este token o ya fue liberado, recargue la página.',
                    'status' => 404,
                ], 404);
            }

            $observador = Observadores::findOrFail($asignacion->observador_id);

            $observador->nombre_completo = $validated['nombre_completo'] ?? $observador->nombre_completo;
            $observador->ci = $validated['ci'] ?? null;
            $observador->identificador = $validated['identificador'] ?? null;
            $observador->organizacion_politica = $validated['organizacion_politica'] ?? null;

            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                $image = $manager->read($file->getPathname());
                $compressed = $image->scale(width: 600)->toJpeg(quality: 70);

                $observador->foto = $compressed->toString();
            } else {
                // Si no se proporciona una nueva foto, mantener la existente
                $observador->foto = $observador->foto;
            }

            $observador->save();

            return response()->json([
                'res' => true,
                'msg' => 'Datos del observador actualizados correctamente',
                'status' => 200,
                'observador' => $observador->makeHidden(['foto'])->toArray() + [
                    'foto' => $observador->foto ? base64_encode($observador->foto) : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar los datos del observador',
                'status' => 500,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Procesa y comprime la imagen del observador.
     */
    private function procesarFoto($file)
    {
        $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
        $image = $manager->read($file->getPathname());
        $compressed = $image->scale(width: 600)->toJpeg(quality: 70);
        return $compressed->toString();
    }
}
