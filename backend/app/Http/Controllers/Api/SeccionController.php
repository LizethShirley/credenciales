<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSeccionRequest;
use App\Models\Seccion;
use App\Http\Requests\StoreSeccionRequest;
use Illuminate\Http\Request;

class SeccionController extends Controller
{
    /**
     * @return mixed
     */
    public function list()
    {
        try {
            return response()->json(Seccion::all(), 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar las secciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param StoreSeccionRequest $request
     * @return mixed
     */
    public function store(StoreSeccionRequest $request)
    {
        try {
            $validated = $request->validated();

            $seccion = Seccion::create($validated);

            return response()->json([
                'seccion' => $seccion,
                'status' => 201,
                'res' => true,
                'msg' => 'Sección creada exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear la sección',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param $id
     * @return mixed
     */
    public function show($id)
    {
        try {
            $seccion = Seccion::find($id);

            if (!$seccion) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Sección no encontrada'
                ], 404);
            }

            return response()->json($seccion, 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener la sección',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getCargos($id)
    {
        try {
            $seccion = Seccion::with('cargos')->findOrFail($id);

            return response()->json([
                'data' => $seccion,
                'status' => 200,
                'res' => true,
                'msg' => 'Cargos de la sección: ' . $seccion->nombre
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener los cargos de la sección: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param StoreSeccionRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateSeccionRequest $request, $id)
    {
        try {
            $seccion = Seccion::find($id);

            if (!$seccion) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Sección no encontrada'
                ], 404);
            }

            $validated = $request->validated();
            $seccion->update($validated);

            return response()->json([
                'seccion' => $seccion,
                'status' => 200,
                'res' => true,
                'msg' => 'Sección actualizada exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar la sección',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listarRelacionados()
    {
        try {
            $secciones = Seccion::with('cargos')->get();

            return response()->json([
                'status' => 200,
                'success' => true,
                'data' => $secciones,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Error al obtener las secciones con cargos',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        try {
            $seccion = Seccion::find($id);

            if (!$seccion) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Sección no encontrada'
                ], 404);
            }

            if ($seccion->cargos()->count() > 0) {
                return response()->json([
                    'res' => false,
                    'msg' => 'No se puede eliminar la sección porque tiene cargos asociados.'
                ], 400);
            }

            $seccion->delete();

            return response()->json([
                'seccion' => $seccion,
                'status' => 200,
                'res' => true,
                'msg' => 'Sección eliminada exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al eliminar la sección',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
