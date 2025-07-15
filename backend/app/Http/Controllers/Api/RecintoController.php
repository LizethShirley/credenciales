<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recinto;
use Illuminate\Http\Request;

class RecintoController extends Controller
{
    /**
     * Obtener todos los recintos
     * @return mixed
     */
    public function list()
    {
        $recintos = Recinto::select([
            'id',
            'nombreProvincia',
            'circun',
            'nomCircun',
            'nombreMunicipio',
            'nombreLocalidad',
            'nomDist',
            'zona',
            'nomZona',
            'codigoRecinto',
            'nombreRecinto',
        ])->get();

        return response()->json([
            'res' => true,
            'msg' => 'Lista de recintos',
            'status' => 200,
            'data' => $recintos,
        ]);
    }

    /**
     * Crear nuevo recinto
     * @param Request $request
     * @return mixed
     */
    public function store(Request $request)
    {
        try {
            $recinto = Recinto::create($request->all());
            return response()->json([
                'res' => true,
                'msg' => 'Recinto creado exitosamente',
                'status' => 201,
                'data' => $recinto,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear recinto',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }


    /**
     * Mostrar un recinto específico
     * @param $id
     * @return mixed
     */
    public function show($id)
    {
        $recinto = Recinto::select([
            'id',
            'nombreProvincia',
            'circun',
            'nomCircun',
            'nombreMunicipio',
            'nombreLocalidad',
            'nomDist',
            'zona',
            'nomZona',
            'codigoRecinto',
            'nombreRecinto',
        ])->find($id);

        if (!$recinto) {
            return response()->json([
                'res' => false,
                'msg' => 'Recinto no encontrado',
                'status' => 404,
            ]);
        }

        return response()->json([
            'res' => true,
            'msg' => 'Datos del recinto',
            'status' => 200,
            'data' => $recinto,
        ]);
    }


    /**
     * Actualizar un recinto existente
     * @param Request $request
     * @param $id
     * @return mixed
     */
    public function update(Request $request, $id)
    {
        $recinto = Recinto::find($id);

        if (!$recinto) {
            return response()->json([
                'res' => false,
                'msg' => 'Recinto no encontrado',
                'status' => 404,
            ], 404);
        }

        $recinto->update($request->all());

        return response()->json([
            'res' => true,
            'msg' => 'Recinto actualizado',
            'status' => 200,
            'data' => $recinto,
        ]);
    }

    /**
     * Eliminar un recinto
     * @param $id
     * @return mixed
     */
    public function destroy($id)
    {
        $recinto = Recinto::find($id);

        if (!$recinto) {
            return response()->json([
                'res' => false,
                'msg' => 'Recinto no encontrado',
                'status' => 404,
            ], 404);
        }

        $recinto->delete();

        return response()->json([
            'res' => true,
            'msg' => 'Recinto eliminado',
            'status' => 200,
        ]);
    }
}

