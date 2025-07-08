<?php

use App\Http\Controllers\SuscriberController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//index

Route::get('suscribers',[SuscriberController::class, 'index']);
//store Almacenar
Route::post('suscribers',[SuscriberController::class, 'store']);
