<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccesoComputo;
use App\Models\AccesoComputoExterno;
use App\Models\RegistroAcceso;
use App\Models\RegistroAccesoExterno;
use Doctrine\Common\Lexer\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Psy\Command\WhereamiCommand;

class RegistroAccesoController extends Controller
{
    /**
     * Registrar acceso desde un token QR
     */
    public function registrarAcceso(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        try {

            $token = $request->input('token');

            if (strpos($token, 'externo') !== false) {

                $token = explode("-", $token)[1];

                $acceso = AccesoComputoExterno::where('token_acceso', $token)
                    ->first();

                if ($acceso && $acceso->activo == 0) {
                    return response()->json([
                        'res' => false,
                        'tipo_credencial' => $acceso ? $acceso->tipo : null,
                        'msg' => 'Token inactivo. No se puede registrar acceso, tiene que ser activado primero.',
                        'status' => 404,
                    ]);
                }

                $observador = DB::table('acceso_computo_observadores')
                    ->join('observadores', 'acceso_computo_observadores.observador_id', '=', 'observadores.id')
                    ->join('acceso_computo_externo', 'acceso_computo_observadores.token_id', '=', 'acceso_computo_externo.id')
                    ->select(
                        'acceso_computo_observadores.*',
                        'observadores.nombre_completo',
                        'observadores.ci',
                        'observadores.identificador',
                        'observadores.organizacion_politica',
                        'observadores.foto',
                        'acceso_computo_externo.token_acceso',
                        'acceso_computo_externo.tipo',
                        'acceso_computo_externo.activo'
                    )
                    ->where('acceso_computo_externo.id', $acceso->id)
                    ->where('acceso_computo_observadores.liberado', NULL)   
                    ->where('acceso_computo_externo.activo', true)
                    ->get()
                    ->first();

                if ($observador && !empty($observador->foto)) {
                    $observador->foto = base64_encode($observador->foto);
                }



                $ultimoRegistro = RegistroAccesoExterno::where('acceso_computo_externo_id', $acceso->id)
                    ->orderBy('fecha_hora', 'desc')
                    ->first();

                $nuevoTipo = ($ultimoRegistro && $ultimoRegistro->tipo === 'entrada') ? 'salida' : 'entrada';

                $registro = RegistroAccesoExterno::create([
                    'acceso_computo_externo_id' => $acceso->id,
                    'tipo' => $nuevoTipo,
                    'fecha_hora' => now(),
                ]);

                return response()->json([
                    'res' => true,
                    'msg' => "Acceso a área de Observación, {$nuevoTipo}",
                    'tipo' => $nuevoTipo,
                    'observador' => $observador,
                    'tipo_credencial' => $acceso->tipo,
                    'status' => 200,
                ]);
            } else {
                $acceso = AccesoComputo::where('token_acceso', $token)
                    ->where('activo', true)
                    ->first();

                $controladorPersonal = new PersonalController();

                $personalData = $controladorPersonal->obtenerPersonalArray($acceso->personal_id);

                if (!$acceso) {
                    return response()->json([
                        'res' => false,
                        'msg' => 'Acceso no encontrado o inactivo.',
                        'status' => 404
                    ], 404);
                }

                $ultimoRegistro = RegistroAcceso::where('acceso_computo_id', $acceso->id)
                    ->orderBy('fecha_hora', 'desc')
                    ->first();

                $nuevoTipo = ($ultimoRegistro && $ultimoRegistro->tipo === 'entrada') ? 'salida' : 'entrada';

                $registro = RegistroAcceso::create([
                    'acceso_computo_id' => $acceso->id,
                    'tipo'              => $nuevoTipo,
                    'fecha_hora'        => now(),
                ]);

                return response()->json([
                    'res'      => true,
                    'msg'      => "Acceso a Cómputo, {$nuevoTipo}",
                    'tipo'     => $nuevoTipo,
                    'registro' => $registro,
                    'personal' => $personalData,
                    'status'   => 200,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Error al registrar acceso desde QR: ' . $e->getMessage());

            return response()->json([
                'res'   => false,
                'msg'   => 'Error procesando el token',
                'error' => $e->getMessage(),
                'status' => 400
            ], 400);
        }
    }

    /**
     * Listar todos los accesos registrados (opcional)
     */
    public function listarRegistros()
    {
        $registros = RegistroAcceso::with('accesoComputo.personal')->orderBy('fecha_hora', 'desc')->get();

        return response()->json([
            'res' => true,
            'msg' => 'Listado de registros de acceso',
            'status' => 200,
            'total' => $registros->count(),
            'registros' => $registros
        ]);
    }
}
