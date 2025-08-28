<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccesoComputoExterno extends Model
{
    protected $table = 'acceso_computo_externo';
    protected $fillable = [
        'token_acceso',
        'tipo',
        'nombre_completo',
        'ci',
        'foto',
        'identificador',
        'organizacion_politica',
        'qr',
        'barcode',
        'activo',
    ];
}
