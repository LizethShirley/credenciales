<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Exception;

class UserController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function list(): JsonResponse
    {
        try {
            return response()->json(User::all(), 200);
        } catch (Exception $e) {
            return response()->json(['res' => false, 'msg' => 'Error al obtener los usuarios', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * @param UpdateUserRequest $request
     * @return JsonResponse
     */
    public function store(UpdateUserRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            return response()->json([
                'user' => $user,
                'status' => 201,
                'res' => true,
                'msg' => 'Usuario registrado exitosamente'
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al registrar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * @param User $user
     * @return JsonResponse
     */
    public function show($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Usuario no encontrado'
                ], 404);
            }

            return response()->json($user, 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al obtener el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @param UpdateUserRequest $request
     * @param $id
     * @return mixed
     */
    public function update(UpdateUserRequest $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Usuario no encontrado'
                ], 404);
            }

            $validated = $request->validated();

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            $user->update($validated);

            return response()->json([
                'user' => $user,
                'status' => 200,
                'res' => true,
                'msg' => 'Usuario actualizado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * @param User $id
     * @return JsonResponseç
     */
    public function destroy(User $id): JsonResponse
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'res' => false,
                    'msg' => 'Usuario no encontrado'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'user' => $user,
                'status' => 200,
                'res' => true,
                'msg' => 'Usuario eliminado'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'res' => false,
                'msg' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

