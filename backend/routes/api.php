<?php

use App\Http\Controllers\Api\AccesoComputoController;
use App\Http\Controllers\Api\AccesoComputoExternoController;
use App\Http\Controllers\Api\AccesoComputoObservadoresController;
use App\Http\Controllers\Api\CargoController;
use App\Http\Controllers\Api\PersonalController;
use App\Http\Controllers\Api\RegistroAccesoController;
use App\Http\Controllers\Api\RegistroAccesoExternoController;
use App\Http\Controllers\Api\ObservadoresController;
use App\Http\Controllers\Api\SeccionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Api\RecintoController;
use App\Http\Controllers\SuscriberController;
use App\Models\AccesoComputoExterno;
use Illuminate\Support\Facades\Route;

Route::post('auth/register', [AuthController::class, 'register']);
Route::post('registrarPersonal', [PersonalController::class, 'storePublic'])->withoutMiddleware(['auth:sanctum']);
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

//Rutas para Personal
Route::get('list/personal', [PersonalController::class, 'list']);
Route::post('personal', [PersonalController::class, 'store'])->withoutMiddleware(['auth:sanctum']);
Route::get('personal/{personal}', [PersonalController::class, 'show']);
Route::put('personal/{personal}', [PersonalController::class, 'update']);
Route::delete('personal/{personal}', [PersonalController::class, 'destroy']);
Route::post('list/personal-ids', [PersonalController::class, 'getByIds']);
Route::get('list/personal-filter', [PersonalController::class, 'filtroPersonal']);
Route::patch('updateEstado', [PersonalController::class, 'updateStatus']);
Route::get('list/personalCI', [PersonalController::class, 'getPersonalCI']);
Route::get('list/personalPaginated', [PersonalController::class, 'listPaginated']);
Route::put('updateEstadoComputo', [PersonalController::class, 'updateStatusComputo']);

//Rutas recintos
Route::get('list/recintos', [RecintoController::class, 'list']);
Route::post('recintos', [RecintoController::class, 'store']);
Route::get('recintos/{id}', [RecintoController::class, 'show']);
Route::put('recintos/{id}', [RecintoController::class, 'update']);
Route::delete('recintos/{id}', [RecintoController::class, 'destroy']);

//Rutas Accesso Computo
//Generar token y QRgit 
Route::post('acceso-computo/generar-qr', [AccesoComputoController::class, 'generarTokenQR']);
Route::post('registro-acceso/registrar', [RegistroAccesoController::class, 'registrarAcceso']);
Route::get('registro-acceso/listar', [RegistroAccesoController::class, 'listarRegistros']);

Route::post('generar-accesos', [AccesoComputoExternoController::class, 'generateQRExternoMasivo']); //Generar varios QR externos
Route::post('registro-acceso-externo/registrar', [RegistroAccesoExternoController::class, 'registrarAccesoExterno']); //Registrar acceso externo entrada/salida
Route::get('acceso-externo/listar', [AccesoComputoExternoController::class, 'listarAccesosExternos']); 
Route::post('activarQr/{token}', [AccesoComputoExternoController::class, 'activarAccesoComputoExterno']); //Registrar user que usara el qr
Route::post('actualizar-observador/{token}', [AccesoComputoExternoController::class, 'updateObservador']); //Actualizar datos del user que usara el qr

Route::post('liberarToken/{token}', [AccesoComputoObservadoresController::class, 'updateLiberarToken']);//Liberar token de observador
Route::post('liberarObservador/{ci_observador}', [AccesoComputoObservadoresController::class, 'updateLiberarObservador']);//Liberar token de observador
Route::get('list/acceso-computo-observadores', [AccesoComputoObservadoresController::class, 'list']);//listar accesos generados -  historial
Route::get('acceso-computo-observadores/filter', [AccesoComputoObservadoresController::class, 'filtrar']);//filtrar accesos externos generados
Route::post('enlazar-qr-observador', [AccesoComputoObservadoresController::class, 'store']);//En lazar token con observador por ids

//Observadores
Route::get('list/observadores', [ObservadoresController::class, 'index']);
Route::post('observadores', [ObservadoresController::class, 'store']);
Route::post('actualizar-observadores/{id}', [ObservadoresController::class, 'update']);
Route::delete('eliminar-observadores/{id}', [ObservadoresController::class, 'destroy']);
Route::get('observador/{ci}', [ObservadoresController::class, 'getByCi']);
Route::get('list/observador-cis', [ObservadoresController::class, 'getCisObservadores']);

//Notificaciones
Route::get('personal-notificacion/{lastId?}', [PersonalController::class, 'ultimos']);

//Comparar con excel
Route::post('cargar-datos-excel', [PersonalController::class, 'registrarDatosExcel']);
Route::post('eliminar-datos-excel', [PersonalController::class, 'eliminarDatosExcel']);
Route::post('comparar-datos-excel', [PersonalController::class, 'compararDatosExcel']);
Route::post('listar-datos-excel', [PersonalController::class, 'listarDatosExcel']);
