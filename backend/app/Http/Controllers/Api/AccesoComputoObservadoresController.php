<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccesoComputoObservadores;
use App\Models\AccesoComputoExterno;
use App\Models\Observadores;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class AccesoComputoObservadoresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function list()
    {
        try {
            $observadores = DB::table('acceso_computo_externo')
                ->leftJoin('acceso_computo_observadores', 'acceso_computo_observadores.token_id', '=', 'acceso_computo_externo.id')
                ->leftJoin('observadores', 'acceso_computo_observadores.observador_id', '=', 'observadores.id')
                ->select(
                    'acceso_computo_externo.id as acceso_externo_id',
                    'acceso_computo_externo.token_acceso',
                    'acceso_computo_externo.tipo',
                    'acceso_computo_externo.activo',
                    'acceso_computo_observadores.id as acceso_observador_id',
                    'acceso_computo_observadores.asignado',
                    'acceso_computo_observadores.liberado',
                    'observadores.id as observador_id',
                    'observadores.nombre_completo',
                    'observadores.ci',
                    'observadores.identificador',
                    'observadores.organizacion_politica',
                    'observadores.foto'
                )
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
                'msg' => 'Lista de acceso a cómputo para observadores obtenida exitosamente',
                'status' => 200,
                'acceso_computo_observadores' => $observadores
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener la lista de acceso a cómputo para observadores',
                'status' => 500,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function filtrar(Request $request)
    {
        $request->validate([
            'cantidad' => 'nullable|integer|min:1|max:100',
            'tipo' => 'nullable|in:candidato,delegado,prensa,observador,publico',
            'activo' => 'nullable|boolean',
            'asignado' => 'nullable|date',
            'ci' => 'nullable|string',
            'nombre_completo' => 'nullable|string',
            'tokens' => 'nullable|array',
            'tokens.*' => 'string',
        ]);

        try {
            $observadores = DB::table('acceso_computo_externo')
                ->leftJoin('acceso_computo_observadores', function ($join) {
                    $join->on('acceso_computo_observadores.token_id', '=', 'acceso_computo_externo.id')
                        ->where('acceso_computo_externo.activo', 1)
                        ->whereNull('acceso_computo_observadores.liberado');
                })
                ->leftJoin('observadores', 'acceso_computo_observadores.observador_id', '=', 'observadores.id')
                ->select(
                    'acceso_computo_externo.id as acceso_externo_id',
                    'acceso_computo_externo.token_acceso',
                    'acceso_computo_externo.tipo',
                    'acceso_computo_externo.activo',
                    'acceso_computo_observadores.id as acceso_observador_id',
                    'acceso_computo_observadores.asignado',
                    'acceso_computo_observadores.liberado',
                    'observadores.id as observador_id',
                    'observadores.nombre_completo',
                    'observadores.ci',
                    'observadores.identificador',
                    'observadores.organizacion_politica',
                    'observadores.foto'
                )
                ->when($request->filled('tipo'), function ($query) use ($request) {
                    $query->where('acceso_computo_externo.tipo', $request->input('tipo'));
                })
                ->when($request->filled('activo'), function ($query) use ($request) {   
                    $query->where('acceso_computo_externo.activo', $request->input('activo'));
                })
                ->when($request->filled('asignado'), function ($query) use ($request) {
                    $query->whereDate('acceso_computo_observadores.asignado', $request->input('asignado'));
                })
                ->when($request->filled('ci'), function ($query) use ($request) {
                    $query->where('observadores.ci', 'like', '%' . $request->input('ci') . '%');
                })
                ->when($request->filled('nombre_completo'), function ($query) use ($request) {
                    $query->where('observadores.nombre_completo', 'like', '%' . $request->input('nombre_completo') . '%');
                })
                ->when($request->filled('tokens'), function ($query) use ($request) {
                    $query->whereIn('acceso_computo_externo.token_acceso', $request->input('tokens'));
                })
                ->limit($request->input('cantidad', 50))
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
                'msg' => 'Lista de acceso a cómputo para observadores obtenida exitosamente',
                'status' => 200,
                'acceso_computo_observadores' => $observadores
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener la lista de acceso a cómputo para observadores',
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
                'token_id' => [
                    'required',
                    Rule::exists('acceso_computo_externo', 'id')->where('activo', 0),
                ],
                'observador_id' => 'required|exists:observadores,id',
            ]);

            $observador = AccesoComputoObservadores::where('observador_id', $data['observador_id'])
                ->whereNull('liberado')
                ->first();

            if ($observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'El observador ya tiene un acceso a cómputo activo',
                    'status' => 422
                ], 422);
            }

            $data['asignado'] = now();
            $data['liberado'] = null;

            $accesoComputoExterno = AccesoComputoExterno::where('id', $request['token_id'])->first();

            if (!$accesoComputoExterno) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Token no encontrado',
                    'status' => 404,
                ], 404);
            }

            $accesoComputoExterno->activo = 1;
            $accesoComputoExterno->save();

            $accesoComputoObservador = AccesoComputoObservadores::create($data);


            return response()->json([
                'res' => true,
                'msg' => 'Acceso a cómputo para observador creado exitosamente',
                'status' => 200,
                'acceso_computo_observador' => $accesoComputoObservador
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear acceso a cómputo para observador',
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

            $accesoComputoObservadores = AccesoComputoObservadores::where('token_id', $tokenModel->id)->where('liberado', null)->get();

            if ($accesoComputoObservadores->isEmpty()) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Acceso a cómputo para observador no encontrado o ya está liberado',
                    'status' => 404,
                ], 404);
            }

            foreach ($accesoComputoObservadores as $accesoComputoObservador) {
                $accesoComputoObservador->update([
                    'liberado' => now()
                ]);
            }

            $tokenModel->activo = 0;
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


    public function updateLiberarObservador($ci_observador)
    {
        try {
            // Buscar observador por CI
            $observador = Observadores::where('ci', $ci_observador)->first();
            if (!$observador) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Observador no encontrado',
                    'status' => 404,
                ], 404);
            }
            // Buscar acceso a cómputo activo para el observador
            $accesoComputoObservadores = AccesoComputoObservadores::where('observador_id', $observador->id)->where('liberado', null)->first();
            // Verificar si se encontró el acceso
            if (!$accesoComputoObservadores) {
                return response()->json([
                    'res' => true,
                    'msg' => 'El observador se encontraba sin token asignado. Ahora puede asignarle otro token.',
                    'status' => 200,
                    'observadores' => $observador->makeHidden(['foto'])->toArray() + [
                        'foto' => $observador->foto ? base64_encode($observador->foto) : null
                    ]
                ]);
            }
            // Buscar token asociado
            $tokenModel = AccesoComputoExterno::where('id', $accesoComputoObservadores->token_id)->first();
            if (!$tokenModel) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Token no encontrado',
                    'status' => 404,
                ], 404);
            }

            // Liberar token (poner fecha actual)
            $accesoComputoObservadores->update([
                'liberado' => now()
            ]);

            $tokenModel->activo = 0;
            $tokenModel->save();

            return response()->json([
                'res' => true,
                'msg' => 'Observador y token liberado exitosamente',
                'status' => 200,
                'observadores' => $observador->makeHidden(['foto'])->toArray() + [
                    'foto' => $observador->foto ? base64_encode($observador->foto) : null
                ]
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
