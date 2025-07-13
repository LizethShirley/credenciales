<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use App\Http\Requests\StoreCargoRequest;
use App\Http\Requests\UpdateCargoRequest;
use Illuminate\Http\Request;

class CargoController extends Controller
{
    /**
     * @return mixed
     */
    public function list()
    {
        try {
            return response()->json(Cargo::all(), 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar los cargos',
                'error' => $e->getMessage()
            ], 500);
        }
    }
/**
     * @return mixed
     */
    public function listarRelacionados()
    {
        try {
            $cargos = Cargo::with('seccion')->get();

            return response()->json([
                'data' => $cargos,
                'status' => 200,
                'res' => true,
                'msg' => 'Lista de cargos con sus secciones'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener los cargos: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * @param StoreCargoRequest $request
     * @return mixed
     */
    public function store(StoreCargoRequest $request)
    {
        try {
            $validated = $request->validated();

            $cargo = Cargo::create($validated);

            return response()->json([
                'cargo' => $cargo,
                'status' => 201,
                'res' => true,
                'msg' => 'Cargo creado exitosamente'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear el cargo',
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
            $cargo = Cargo::find($id);

            if (!$cargo) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Cargo no encontrado'
                ], 404);
            }

            return response()->json($cargo, 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener el cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getSecciones($id)
    {
        try {
            $cargo = Cargo::with('seccion')->findOrFail($id);
            return response()->json([
                'cargo' => $cargo,
                'status' => 200,
                'res' => true,
                'msg' => 'Cargo con su sección encontrado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Cargo no encontrado o error: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * @param UpdateCargoRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateCargoRequest $request, $id)
    {
        try {
            $cargo = Cargo::find($id);

            if (!$cargo) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Cargo no encontrado'
                ], 404);
            }

            $validated = $request->validated();
            $cargo->update($validated);

            return response()->json([
                'cargo' => $cargo,
                'status' => 200,
                'res' => true,
                'msg' => 'Cargo actualizado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar el cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**ç
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        try {
            $cargo = Cargo::find($id);

            if (!$cargo) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Cargo no encontrado'
                ], 404);
            }

            $cargo->delete();

            return response()->json([
                'cargo' => $cargo,
                'status' => 200,
                'res' => true,
                'msg' => 'Cargo eliminado exitosamente'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al eliminar el cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

