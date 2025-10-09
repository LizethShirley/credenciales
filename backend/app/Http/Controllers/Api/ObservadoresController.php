<?php

namespace App\Http\Controllers\Api;

use App\Models\Observadores;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Requests\ObservadoresRequest;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\DB;

class ObservadoresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $observadores = Observadores::all();

        return response()->json([
            'res' => true,
            'msg' => 'Lista de observadores obtenida exitosamente',
            'status' => 200,
            'observadores' => $observadores->map(function ($observador) {
                return $observador->makeHidden(['foto'])->toArray() + [
                    'foto' => $observador->foto ? base64_encode($observador->foto) : null
                ];
            })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ObservadoresRequest $request)
    {
        try {
            $validated = $request->validated();
            $observador = Observadores::create($validated);

            return response()->json([
                'res' => true,
                'msg' => 'Observador creado exitosamente',
                'status' => 200,
                'observadores' => $observador->makeHidden(['foto'])->toArray() + [
                    'foto' => $observador->foto ? base64_encode($observador->foto) : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear Observador',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Observadores $observadores)
    {
        //
    }

    public function getByCi($ci)
    {
        try {
            $observador = Observadores::where('ci', $ci)->first();

            if (!$observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Observador no encontrado',
                    'status' => 404
                ], 404);
            }

            // si tiene foto en blob, la convertimos
            if (!empty($observador->foto)) {
                $observador->foto = base64_encode($observador->foto);
            }

            return response()->json([
                'res' => true,
                'msg' => 'Observador encontrado',
                'status' => 200,
                'data' => $observador
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al buscar observador',
                'status' => 500,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Observadores $observadores)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ObservadoresRequest $request, $id)
    {
        try {
            $validated = $request->validated();

            $observador = Observadores::find($id);
            if (!$observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Observador no encontrado',
                    'status' => 404,
                ], 404);
            }
            $observador->update($validated);

            return response()->json([
                'res' => true,
                'msg' => 'Observador actualizado exitosamente',
                'status' => 200,
                'observadores' => $observador->makeHidden(['foto'])->toArray() + [
                    'foto' => $observador->foto ? base64_encode($observador->foto) : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar Observador',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $observador = Observadores::find($id);

            if (!$observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Observador no encontrado',
                    'status' => 404
                ], 404);
            }

            $observador->delete();

            return response()->json([
                'res' => true,
                'msg' => 'Observador eliminado exitosamente',
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al eliminar observador',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    public function getCisObservadores()
    {
        try {
            $cis = Observadores::whereNotNull('ci')->pluck('ci');

            return response()->json([
                'res' => true,
                'msg' => 'CIs de observadores obtenidos exitosamente',
                'status' => 200,
                'cis' => $cis
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener CIs de observadores',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }
}
