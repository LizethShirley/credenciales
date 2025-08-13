<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccesoComputoExterno extends Model
{
    protected $table = 'acceso_computo_externos';
    protected $fillable = [
        'token_acceso',
        'tipo',
        'qr',
        'barcode',
        'activo',
    ];
}
