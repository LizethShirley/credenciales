<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RegistroAccesoExterno extends Model
{
    use HasFactory;

    protected $table = 'registro_accesos';

    protected $fillable = [
        'acceso_computo_externo_id',
        'fecha_hora',
        'tipo',
    ];

    /**
     * Relación con el modelo Personal.
     */
    public function accesoComputoExterno()
    {
        return $this->belongsTo(AccesoComputoExterno::class, 'acceso_computo_externo_id');
    }
}
