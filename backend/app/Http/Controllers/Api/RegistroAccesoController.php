<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccesoComputo;
use App\Models\Personal;
use App\Models\RegistroAcceso;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
                'msg'      => "Acceso registrado como {$nuevoTipo}",
                'tipo'     => $nuevoTipo,
                'registro' => $registro,
                'personal' => $personalData,
                'status'   => 200,
            ]);

        } catch (\Exception $e) {
            Log::error('Error al registrar acceso desde QR: ' . $e->getMessage());

            return response()->json([
                'res'   => false,
                'msg'   => 'Error procesando el token',
                'error' => $e->getMessage(),
                'status'=> 400
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
