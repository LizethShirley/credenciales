<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccesoComputoObservadores;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AccesoComputoExterno;

class AccesoComputoObservadoresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        try {
            $observadores = DB::table('acceso_computo_observadores')
                ->join('observadores', 'acceso_computo_observadores.observador_id', '=', 'observadores.id')
                ->join('acceso_computo_externo', 'acceso_computo_observadores.token_id', '=', 'acceso_computo_externo.id')
                ->select('acceso_computo_observadores.*', 
                    'observadores.nombre_completo',
                    'observadores.ci',
                    'observadores.identificador',
                    'observadores.organizacion_politica', 
                    'acceso_computo_externo.token_acceso', 'acceso_computo_externo.tipo', 'acceso_computo_externo.activo')
                ->get()
                ->map(function ($item) { 
                    $arr = (array) $item;
                    if (!empty($arr['foto'])) {
                        $arr['foto'] = base64_encode($arr['foto']);
                    }
                    return $arr;
                });

            return response()->json([
                'res' => true,
                'msg' => 'Lista de acceso a computo para observadores obtenida exitosamente',
                'status' => 200,
                'acceso_computo_observadores' => $observadores
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener la lista de acceso a computo para observadores',
                'status' => 500,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'token_id' => 'required|exists:acceso_computo_externo,id',
                'observador_id' => 'required|exists:observadores,id',
            ]);

            $data['asignado'] = now();
            $data['liberado'] = null;

            $accesoComputoObservador = AccesoComputoObservadores::create($data);

            return response()->json([
                'res' => true,
                'msg' => 'Acceso a computo para observador creado exitosamente',
                'status' => 200,
                'acceso_computo_observador' => $accesoComputoObservador
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear acceso a computo para observador',
                'status' => 500,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(AccesoComputoObservadores $accesoComputoObservadores)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AccesoComputoObservadores $accesoComputoObservadores)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateLiberarToken($token)
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

            $accesoComputoObservadores = AccesoComputoObservadores::where('token_id', $tokenModel->id)->where('liberado', null)->first();

            if (!$accesoComputoObservadores) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Acceso a cómputo para observador no encontrado o ya está liberado',
                    'status' => 404,
                ], 404);
            }

            // Liberar token (poner fecha actual)
            $accesoComputoObservadores->update([
                'liberado' => now()
            ]);

            $tokenModel->update([
                'activo' => 1 
            ]);

            $tokenModel->activo = false;
            $tokenModel->save();

            return response()->json([
                'res' => true,
                'msg' => 'Token liberado exitosamente',
                'status' => 200,
                'acceso_computo_observador' => $accesoComputoObservadores,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al liberar el token',
                'status' => 500,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccesoComputoObservadores $accesoComputoObservadores)
    {
        //
    }
}
