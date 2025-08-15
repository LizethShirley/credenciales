<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Personal;
use App\Http\Requests\StorePersonalRequest;
use App\Http\Requests\UpdatePersonalRequest;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\DB;

class PersonalController extends Controller
{
    /**
     * Listar todo el personal
     */
    public function list()
    {
        try {
            $personal = DB::table('personal as p')
                ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                // ->leftJoin('recintos as r', 'p.id_recinto', '=', 'r.id')
                ->select(
                    'p.id',
                    'p.nombre',
                    'p.paterno',
                    'p.materno',
                    'p.ci',
                    'p.estado',
                    'p.complemento',
                    'p.extencion',
                    'p.token',
                    'p.email',
                    'p.celular',
                    'p.accesoComputo',
                    'p.ciexterno',
                    'p.ciexterno',
                    'p.photo',
                    'p.updated_at',
                    'c.id as cargo_id',
                    'c.nombre as cargo_nombre',
                    's.id as seccion_id',
                    's.nombre as seccion_nombre',
                    's.abreviatura',
                    // 'r.id as recinto_id',
                    // 'r.nombreRecinto as recinto_nombre',
                    // 'r.nombreMunicipio as recinto_municipio',
                    // 'r.nombreProvincia as recinto_provincia',
                    // 'r.nombreLocalidad as recinto_localidad',
                    // 'r.circun as recinto_circun',
                )
                ->get();

            $personalsArray = $personal->map(function ($personal) {
                $arrayPersonal = (array) $personal;
                $arrayPersonal['photo'] = $personal->photo ? base64_encode($personal->photo) : null;
                return $arrayPersonal;
            });

            return response()->json([
                'res' => true,
                'msg' => 'Lista de personal con recinto, cargo y sección obtenida exitosamente',
                'status' => 200,
                'personal' => $personalsArray,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Listar paginación de personal
     *
     * @return void
     */
    public function listPaginated(Request $request)
    {
        try {
            $perPage = $request->input('per_page', 10);
            $nombreCI = $request->input('nombre_ci', '');
            $cargo = $request->input('cargo', '');
            $fecha = $request->input('fecha', '');
            $impreso = $request->input('impreso', '');
            $orderBy = $request->input('orderBy', '');
            $orderByTipo = $request->input('orderByTipo', 'ASC');

            $personal = DB::table('personal as p')
                ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                ->select(
                    'p.id',
                    DB::raw("CONCAT(p.nombre, ' ', p.paterno, ' ', p.materno) AS nombre_completo"),
                    'p.ci',
                    'p.estado',
                    'p.complemento',
                    'p.extencion',
                    'p.token',
                    'p.email',
                    'p.celular',
                    'p.accesoComputo',
                    'p.ciexterno',
                    'p.photo',
                    'p.updated_at',
                    'c.id as cargo_id',
                    'c.nombre as cargo_nombre',
                    's.id as seccion_id',
                    's.nombre as seccion_nombre',
                    's.abreviatura',
                );

            if ($nombreCI) {
                $personal->where(function ($query) use ($nombreCI) {
                    $query->where(DB::raw("CONCAT(p.nombre, ' ', p.paterno, ' ', p.materno)"), 'like', "%{$nombreCI}%")
                        ->orWhere('p.ci', 'like', "%{$nombreCI}%");
                });
            }

            if ($cargo) {
                $personal->where('c.nombre','like', "%{$cargo}%");
            }

            if ($fecha) {
                $personal->whereDate('p.created_at', $fecha);
            }

            if ($impreso !== '') {
                $personal->where('p.estado', $impreso);
            }

            if ($orderBy) {
                if ($orderBy === 'nombre_completo') {
                    $personal->orderBy(DB::raw("CONCAT(p.nombre, ' ', p.paterno, ' ', p.materno)"), $orderByTipo);
                } elseif ($orderBy === 'cargo_nombre') {
                    $personal->orderBy('c.nombre', $orderByTipo);
                } elseif ($orderBy === 'created_at') {
                    $personal->orderBy('p.created_at', $orderByTipo);
                }
            }

            $personal = $personal->paginate($perPage);

            $personalsArray = $personal->map(function ($personal) {
                $arrayPersonal = (array) $personal;
                $arrayPersonal['photo'] = $personal->photo ? base64_encode($personal->photo) : null;
                return $arrayPersonal;
            });

            return response()->json([
                'res' => true,
                'msg' => 'Lista de personal con recinto, cargo y sección obtenida exitosamente',
                'status' => 200,
                'personal' => $personalsArray,
                'meta' => [
                    'current_page' => $personal->currentPage(),
                    'last_page' => $personal->lastPage(),
                    'per_page' => $personal->perPage(),
                    'total' => $personal->total(),
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }


    /**
     * Listar todo el personal
     */
    public function getPersonalCI()
    {
        try {
            $personal = DB::table('personal as p')
                ->select(
                    'p.id',
                    'p.ci',
                )
                ->get();

            $personalsArray = $personal->map(function ($personal) {
                $arrayPersonal = (array) $personal;
                return $arrayPersonal;
            });

            return response()->json([
                'res' => true,
                'msg' => 'Lista de personal solo CI obtenida exitosamente',
                'status' => 200,
                'personal' => $personalsArray,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar personal por CI',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * @param StorePersonalRequest $request
     * @return mixed
     */
    public function store(StorePersonalRequest $request)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $manager = new ImageManager(new \Intervention\Image\Drivers\Gd\Driver());
                $image = $manager->read($file->getPathname());
                $compressed = $image->scale(width: 600)->toJpeg(quality: 70);

                $validated['photo'] = $compressed->toString();
            }

            $personal = Personal::create($validated);

            $responseData = $personal->toArray();
            unset($responseData['photo']);
            $responseData['photo'] = $personal->photo
                ? base64_encode(is_resource($personal->photo)
                    ? stream_get_contents($personal->photo)
                    : $personal->photo)
                : null;

            return response()->json([
                'res' => true,
                'msg' => 'Personal creado exitosamente',
                'status' => 201,
                'datos' => $responseData
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al crear personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Guardar un nuevo personal
     * @param StorePersonalRequest $request
     * @return
     */
    public function storePublic(StorePersonalRequest $request)
    {
        try {
            $validated = $request->validated();

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $photoData = file_get_contents($file->getRealPath());
                $validated['photo'] = $photoData;
            }

            $personal = Personal::updateOrCreate(
                ['ci' => $validated['ci']],
                $validated
            );

            $responseData = $personal->toArray();
            $responseData['photo'] = $personal->photo ? base64_encode($personal->photo) : null;

            return response()->json([
                'res' => true,
                'msg' => $personal->wasRecentlyCreated
                    ? 'Personal creado exitosamente'
                    : 'Personal actualizado exitosamente',
                'status' => $personal->wasRecentlyCreated ? 201 : 200,
                'datos' => $responseData
            ], $personal->wasRecentlyCreated ? 201 : 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al guardar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Mostrar un personal por ID con sus relaciones
     */
    public function show($id)
    {
        try {
            $personal = DB::table('personal as p')
                ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                ->leftJoin('recintos as r', 'p.id_recinto', '=', 'r.id')
                ->where('p.id', $id)
                ->select(
                    'p.id',
                    'p.nombre',
                    'p.paterno',
                    'p.materno',
                    'p.ci',
                    'p.estado',
                    'p.complemento',
                    'p.extencion',
                    'p.token',
                    'p.email',
                    'p.celular',
                    'p.accesoComputo',
                    'p.ciexterno',
                    'p.photo',
                    'p.updated_at',
                    // Campos específicos de cargo
                    'c.id as cargo_id',
                    'c.nombre as cargo_nombre',
                    // Campos específicos de seccion
                    's.id as seccion_id',
                    's.nombre as seccion_nombre',
                    // Campos específicos de recinto
                    'r.id as recinto_id',
                    'r.nombreRecinto as recinto_nombre',
                    'r.nombreMunicipio as recinto_municipio',
                    'r.nombreProvincia as recinto_provincia',
                    'r.nombreLocalidad as recinto_localidad',
                    'r.circun as recinto_circun',
                )
                ->first();

            if (!$personal) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Personal no encontrado',
                    'status' => 404
                ], 404);
            }

            $personal = (array) $personal;


            $personal['photo'] = $personal['photo'] ? base64_encode($personal['photo']) : null;

            return response()->json([
                'res' => true,
                'msg' => 'Personal encontrado exitosamente',
                'status' => 200,
                'personal' => $personal
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener personal',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * Mostrar un personal por ID con sus relaciones
     */
    public function obtenerPersonalArray($id)
    {
        try {
            $personal = DB::table('personal as p')
                ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                ->leftJoin('recintos as r', 'p.id_recinto', '=', 'r.id')
                ->where('p.id', $id)
                ->select(
                    'p.nombre',
                    'p.paterno',
                    'p.materno',
                    'p.ci',
                    'p.estado',
                    'p.complemento',
                    'p.accesoComputo',
                    'p.photo',
                    'c.nombre as cargo_nombre',
                    's.nombre as seccion_nombre',
                )
                ->first();

            if (!$personal) {
                return null; // Aquí solo devuelves null si no existe
            }

            $personal = (array) $personal;
            $personal['photo'] = $personal['photo'] ? base64_encode($personal['photo']) : null;

            return $personal;

        } catch (\Exception $e) {
            return null;
        }
    }

    public function getById($id)
    {
        $personal = $this->obtenerPersonalArray($id);

        if (!$personal) {
            return response()->json(['msg' => 'Personal no encontrado'], 404);
        }

        return response()->json($personal);
    }


    /**
     * Actualizar un personal
     */
    public function update(UpdatePersonalRequest $request, $id)
    {
        try {
            $personal = Personal::find($id);

            if (!$personal) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Personal no encontrado',
                    'status' => 404
                ], 404);
            }

            $validated = $request->validated();

            if ($request->hasFile('photo')) {
                $image = $request->file('photo');
                $binary = file_get_contents($image->getRealPath());

                $validated['photo'] = $binary;
            }

            $personal->update($validated);
            $responseData = $personal->toArray();
            $responseData['photo'] = $personal->photo ? base64_encode($personal->photo) : null;

            return response()->json([
                'res' => true,
                'msg' => 'Personal actualizado exitosamente',
                'status' => 200,
                'personal' => $personal
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Eliminar un personal
     */
    public function destroy($id)
    {
        try {
            $personal = Personal::find($id);

            if (!$personal) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Personal no encontrado',
                    'status' => 404
                ], 404);
            }

            $responseData = $personal->toArray();
            $responseData['photo'] = $personal->photo ? base64_encode($personal->photo) : null;
            $personal->delete();

            return response()->json([
                'res' => true,
                'msg' => 'Personal eliminado exitosamente',
                'status' => 200,
                'personal' => $responseData
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al eliminar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ], 500);
        }
    }

    public function getByIds(Request $request)
    {
        try {
            $ids = $request->input('ids', []);

            if (!is_array($ids) || empty($ids)) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Debe enviar un array no vacío de IDs',
                    'status' => 400
                ], 400);
            }

            $personals = DB::table('users as p')
                ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                ->leftJoin('secciones as s', 'c.id_seccion', '=', 's.id')
                ->leftJoin('recintos as r', 'p.id_recinto', '=', 'r.id')
                ->whereIn('p.id', $ids)
                ->select(
                    'p.id',
                    'p.nombre',
                    'p.paterno',
                    'p.materno',
                    'p.ci',
                    'p.estado',
                    'p.complemento',
                    'p.extencion',
                    'p.token',
                    'p.email',
                    'p.celular',
                    'p.accesoComputo',
                    'p.ciexterno',
                    'p.photo',
                    'c.id as cargo_id',
                    'c.nombre as cargo_nombre',
                    's.id as seccion_id',
                    's.nombre as seccion_nombre',
                    'r.id as recinto_id',
                    'r.nombreRecinto as recinto_nombre'
                )
                ->get()
                ->map(function ($item) {
                    $item = (array) $item;
                    $item['photo'] = $item['photo'] ? base64_encode($item['photo']) : null;
                    return $item;
                });

            return response()->json([
                'res' => true,
                'msg' => 'Personal encontrados exitosamente',
                'status' => 200,
                'personal' => $personals
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener personal',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * @param Request $request
     * @return mixed
     */
    public function filtroPersonal(Request $request)
    {
        $request->validate([
            'inicio' => 'nullable|date',
            'fin' => 'nullable|date|after_or_equal:inicio',
            'cargo' => 'nullable|integer|exists:cargos,id',
            'circunscripcion' => 'nullable|string|max:10',
            'personal' => 'nullable|array',
            'personal.*' => 'string|max:20',
            'accesoComputo' => 'nullable|integer|in:0,1',
        ]);

        $date_ini = $request->inicio;
        $date_fin = $request->fin;
        $cargo = $request->cargo;
        $array_ci = $request->personal;
        $circunscripcion = $request->circunscripcion;
        $accesoComputo = $request->accesoComputo;

        try {

            if (!empty($accesoComputo) && $accesoComputo == 1) {
                 $personal = DB::table('personal as p')
                    ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                    ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                    ->leftJoin('acceso_computo as a', 'p.id', '=', 'a.personal_id')
                    ->select(
                        'p.id', 'p.nombre', 'p.paterno', 'p.materno', 'p.ci', 'a.qr', 'a.barcode', 'c.color', 'p.id_cargo','c.nombre'
                    )->where('p.accesoComputo', $accesoComputo);
            } else {
                $personal = DB::table('personal as p')
                    ->leftJoin('cargos as c', 'p.id_cargo', '=', 'c.id')
                    ->leftJoin('secciones as s', 'c.idseccion', '=', 's.id')
                    ->select(
                        'p.id', 'p.nombre', 'p.paterno', 'p.materno', 'p.ci',
                        'p.estado', 'p.complemento', 'p.extencion', 'p.token',
                        'p.email', 'p.celular', 'p.accesoComputo', 'p.ciexterno',
                        'p.photo',
                        'c.id as cargo_id', 'c.nombre as cargo_nombre',
                        's.id as seccion_id', 's.nombre as seccion_nombre'
                    );
            }

            if (!empty($date_ini) && !empty($date_fin)) {
                $personal->whereBetween('p.updated_at', [
                    $date_ini . ' 00:00:00',
                    $date_fin . ' 23:59:59',
                ]);
            }

            if (!empty($cargo)) {
                $personal->where('c.id', $cargo);
            }

            if (!empty($circunscripcion)) {
                $personal->where('p.ciexterno', $circunscripcion);
            }

            if (!empty($array_ci) && is_array($array_ci)) {
                $personal->whereIn('p.ci', $array_ci);
            }

            $personal->orderBy('p.created_at', 'asc');

            if (!empty($accesoComputo)) {
                $data = $personal->get()->map(function ($p) {
                    $arrayPersonal = (array) $p;
                    $arrayPersonal['qr'] = $p->qr ? base64_encode($p->qr) : null;
                    return $arrayPersonal;
                });
            } else {
                $data = $personal->get()->map(function ($p) {
                    $arrayPersonal = (array) $p;
                    $arrayPersonal['photo'] = $p->photo ? base64_encode($p->photo) : null;
                    return $arrayPersonal;
                });
            }

            return response()->json([
                'res' => true,
                'msg' => 'Lista de personal filtrada exitosamente',
                'status' => 200,
                'total' => $data->count(),
                'personal' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al listar personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ]);
        }
    }

    public function updateStatus(Request $request) {
        $request->validate([
            'ids' => 'required|array',
            'estado' => 'required|integer|in:0,1',
        ]);

        $ids = $request->input('ids');
        $estado = $request->input('estado');
        try {
            $updatedCount = Personal::whereIn('id', $ids)->update(['estado' => $estado]);

            return response()->json([
                'res' => true,
                'msg' => 'Estado de Impresión del personal actualizado exitosamente', 
                'status' => 200,
                'updated_count' => $updatedCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar el estado de Impresión del personal',
                'error' => $e->getMessage(),
                'status' => 500,
            ]);
        }
    }
}
;
