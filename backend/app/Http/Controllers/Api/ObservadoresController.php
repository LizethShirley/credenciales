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
    public function index() {
        $observadores = Observadores::all();

        return response()->json([
            'res' => true,
            'msg' => 'Lista de observadores obtenida exitosamente',
            'status' => 200,
            'observadores' => $observadores->map(function ($observador) {
                return $observador->makeHidden(['foto'])->toArray() + [
                    'foto_base64' => $observador->foto ? base64_encode($observador->foto) : null
                ];
            })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(ObservadoresRequest $request)
    {
        $observador = Observadores::create($request->all());

        return response()->json([
        'res' => true,
        'msg' => 'Lista de observadores obtenida exitosamente',
        'status' => 200,
        'observadores' => $observador->makeHidden(['foto'])->toArray() + [
            'foto_base64' => $observador->foto ? base64_encode($observador->foto) : null]   
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Observadores $observadores)
    {
        //
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
            $observador = Observadores::find($id);

            if (!$observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Observador no encontrado',
                    'status' => 404
                ], 404);
            }

            $validated = $request->validated();

            // if ($request->hasFile('photo')) {
            //     $image = $request->file('photo');
            //     $binary = file_get_contents($image->getRealPath());

            //     $validated['photo'] = $binary;
            // }

            $observador->update($validated);
            // $responseData = $observador->toArray();
            // $responseData['photo'] = $observador->photo ? base64_encode($observador->photo) : null;

            return response()->json([
                'res' => true,
                'msg' => 'Observador actualizado exitosamente',
                'status' => 200,
                'observador' => $observador->makeHidden(['foto'])->toArray() + [
                    'foto_base64' => $observador->foto ? base64_encode($observador->foto) : null
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar observador',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Observadores $observadores)
    {
        //
    }
}
