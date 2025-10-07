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

    public function listarAccesosExternos()
    {
        $accesos = DB::table('acceso_computo_externo as a')
            ->select(
                'a.id',
                'a.token_acceso',
                'a.tipo',
                'a.activo',
                // 'a.nombre_completo',
                // 'a.ci',
                // 'a.foto',
                // 'a.identificador',
                // 'a.organizacion_politica',
                'a.qr',
                'a.barcode',
                'a.created_at',
                'a.updated_at'
            )
            ->leftJoin('acceso_computo_observadores as ao', 'a.id', '=', 'ao.token_id')
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
        $token = AccesoComputoExterno::where('token_acceso', $token)->firstOrFail();
        
        $validated = $request->validated();

        $observador = new Observadores();
        $observador->nombre_completo = $validated['nombre_completo'];
        $observador->ci = $validated['ci'];
        $observador->identificador = $validated['identificador'] ?? null;
        $observador->organizacion_politica = $validated['organizacion_politica'] ?? null;

        if ($request->hasFile('foto')) {
            $file = $request->file('foto');
            $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
            $image = $manager->read($file->getPathname());
            $compressed = $image->scale(width: 600)->toJpeg(quality: 70);

            $observador->foto = $compressed->toString();
        }

        $observador->save();

        $asignacion = AccesoComputoObservadores::create([
            'token_id' => $token->id,
            'observador_id' => $observador->id,
            'asignado' => now(),
            'liberado' => null,
        ]);

        $token->activo = 1;
        $token->save();

        return response()->json([
            'res' => true,
            'msg' => 'Observador registrado y token asignado correctamente',
            'status' => 200,
            'observador' => $observador->makeHidden(['foto'])->toArray() + [
                'foto' => $observador->foto ? base64_encode($observador->foto) : null
            ],
            'asignacion' => $asignacion
        ]);
    }

    public function updateObservador(ActualizarObservadorRequest $request, $token)
    {
        try {
            $tokenModel = AccesoComputoExterno::where('token_acceso', $token)->firstOrFail();
            

            $asignacion = AccesoComputoObservadores::where('token_id', $tokenModel->id)
                ->whereNull('liberado')
                ->first();

            if (!$asignacion) {
                return response()->json([
                    'res' => false,
                    'msg' => 'No hay un observador asignado a este token o ya fue liberado',
                    'status' => 404,
                ], 404);
            }

            $observador = Observadores::findOrFail($asignacion->observador_id);

            $validated = $request->validated();

            $observador->nombre_completo = $validated['nombre_completo'] ?? $observador->nombre_completo;
            $observador->ci = $validated['ci'] ?? $observador->ci;
            $observador->identificador = $validated['identificador'] ?? null;
            $observador->organizacion_politica = $validated['organizacion_politica'] ?? null;

            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                $image = $manager->read($file->getPathname());
                $compressed = $image->scale(width: 600)->toJpeg(quality: 70);

                $observador->foto = $compressed->toString();
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

}
