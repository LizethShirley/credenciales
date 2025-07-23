<?php

namespace App\Http\Controllers;

use App\Models\AccesoComputo;
use App\Models\RegistroAcceso;
use Illuminate\Http\Request;

class ResgitroAccesoComputoController extends Controller
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
            // Descifrar el token
            $datos = Crypt::decrypt($request->input('token'));

            $personalId = $datos['personal_id'];
            $ci         = $datos['ci'];

            // Buscar el acceso activo correspondiente
            $acceso = AccesoComputo::where('personal_id', $personalId)
                ->where('activo', true)
                ->latest('fecha_generado')
                ->first();

            if (!$acceso) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Acceso no encontrado o inactivo para esta persona.',
                    'status' => 404
                ], 404);
            }

            // Determinar si es entrada o salida
            $ultimoRegistro = RegistroAcceso::where('acceso_computo_id', $acceso->id)
                ->orderBy('fecha_hora', 'desc')
                ->first();

            $nuevoTipo = ($ultimoRegistro && $ultimoRegistro->tipo === 'entrada') ? 'salida' : 'entrada';

            // Registrar nuevo acceso
            $registro = RegistroAcceso::create([
                'acceso_computo_id' => $acceso->id,
                'tipo' => $nuevoTipo,
                'fecha_hora' => now()
            ]);

            return response()->json([
                'res' => true,
                'msg' => "Acceso registrado correctamente como {$nuevoTipo}",
                'tipo' => $nuevoTipo,
                'registro' => $registro,
                'status' => 200
            ]);

        } catch (\Exception $e) {
            // Puedes registrar el error si es necesario
            Log::error('Error al registrar acceso desde QR: ' . $e->getMessage());

            return response()->json([
                'res' => false,
                'msg' => 'Token inválido o manipulado',
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
