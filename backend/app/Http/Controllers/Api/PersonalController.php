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
                ->leftJoin('recintos as r', 'p.id_recinto', '=', 'r.id')
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
                    'r.nombreRecinto as recinto_nombre',
                    'r.nombreMunicipio as recinto_municipio',
                    'r.nombreProvincia as recinto_provincia',
                    'r.nombreLocalidad as recinto_localidad',
                    'r.circun as recinto_circun',
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
    public function filtroPesonal(Request $request)
    {
        $request->validate([
            'inicio' => 'nullable|date',
            'fin' => 'nullable|date|after_or_equal:inicio',
            'cargo' => 'nullable|integer|exists:cargos,id',
            'circunscripcion' => 'nullable|string|max:10',
            'personal' => 'nullable|array',
            'personal.*' => 'string|max:20',
        ]);

        $date_ini = $request->inicio;
        $date_fin = $request->fin;
        $cargo = $request->cargo;
        $array_ci = $request->personal;
        $circunscripcion = $request->circunscripcion;

        try {
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

            $personal->orderBy('p.updated_at', 'asc');

            $data = $personal->get()->map(function ($p) {
                $arrayPersonal = (array) $p;
                $arrayPersonal['photo'] = $p->photo ? base64_encode($p->photo) : null;
                return $arrayPersonal;
            });


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
}
;
