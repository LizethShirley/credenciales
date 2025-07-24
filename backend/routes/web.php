<?php

use Illuminate\Support\Facades\Route;

//Route::get('/', function () {
//    return view('welcome');
//});

Route::get('/', function () {
    return response()->json(['res' => true, 'msg' => 'API Laravel funcionando']);
});
