<?php

use App\Http\Controllers\Api\CargoController;
use App\Http\Controllers\Api\PersonalController;
use App\Http\Controllers\Api\SeccionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\SuscriberController;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('registrarPersonal', [PersonalController::class, 'storePublic']);
Route::post('auth/login', [AuthController::class, 'login']);

//Route::middleware('auth:sanctum')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Rutas para Users que manejaran el sistema
    Route::get('list/users', [UserController::class, 'list']);
    Route::post('users', [UserController::class, 'store']);
    Route::get('users/{user}', [UserController::class, 'show']);
    Route::put('users/{user}', [UserController::class, 'update']);
    Route::delete('users/{user}', [UserController::class, 'destroy']);

    // Rutas para cargos
    Route::get('list/cargos', [CargoController::class, 'list']);
    Route::get('list/cargos-secciones', [CargoController::class, 'listarRelacionados']);
    Route::post('cargos', [CargoController::class, 'store']);
    Route::get('cargos/{cargo}', [CargoController::class, 'show']);
    Route::get('cargos/cargo-secciones/{cargo}', [CargoController::class, 'getSecciones']);
    Route::put('cargos/{cargo}', [CargoController::class, 'update']);
    Route::delete('cargos/{cargo}', [CargoController::class, 'destroy']);

    // Rutas para secciones
    Route::get('list/secciones', [SeccionController::class, 'list']);
    Route::get('list/secciones-cargos', [SeccionController::class, 'listarRelacionados']);
    Route::post('secciones', [SeccionController::class, 'store']);
    Route::get('secciones/{seccion}', [SeccionController::class, 'show']);
    Route::get('secciones/secciones-cargos/{seccion}', [SeccionController::class, 'getCargos']);
    Route::put('secciones/{seccion}', [SeccionController::class, 'update']);
    Route::delete('secciones/{seccion}', [SeccionController::class, 'destroy']);

    //Personal
    Route::get('list/personal', [PersonalController::class, 'list']);
    Route::post('personal', [PersonalController::class, 'store']);
    Route::get('personal/{personal}', [PersonalController::class, 'show']);
    Route::put('personal/{personal}', [PersonalController::class, 'update']);
    Route::delete('personal/{personal}', [PersonalController::class, 'destroy']);
    Route::post('list/personal-ids', [PersonalController::class, 'getByIds']);

//});
