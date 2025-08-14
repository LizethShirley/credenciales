<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\AccesoComputoExterno;
use App\Models\RegistroAccesoExterno;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;

class RegistroAccesoExternoController extends Controller
{
    /**
     * Registrar acceso desde un token QR
     */
    public function registrarAccesoExterno(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
        ]);

        try {
            $token = $request->input('token');

            $acceso = AccesoComputoExterno::where('token_acceso', $token)
                ->where('activo', true)
                ->first();

            if (!$acceso) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Usuario Inactivo.',
                    'status' => 404
                ]);
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
                'msg' => "Acceso Correcto, Entrada {$nuevoTipo}",
                'tipo' => $nuevoTipo,
                'registro' => $registro,
                'status' => 200,
            ]);

        } catch (\Exception $e) {
            Log::error('Error al registrar acceso desde QR: ' . $e->getMessage());

            return response()->json([
                'res' => false,
                'msg' => 'Error procesando el token',
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
        $registros = RegistroAccesoExterno::with('accesoComputoExterno')->orderBy('fecha_hora', 'desc')->get();

        return response()->json([
            'res' => true,
            'msg' => 'Listado de registros de acceso',
            'status' => 200,
            'total' => $registros->count(),
            'registros' => $registros
        ]);
    }
}
