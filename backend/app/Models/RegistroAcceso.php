<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroAcceso extends Model
{
    use HasFactory;

    protected $table = 'registro_accesos';

    protected $fillable = [
        'acceso_computo_id',
        'fecha_hora',
        'tipo',
    ];

    /**
     * Relación con el modelo Personal.
     */
    public function accesoComputo()
    {
        return $this->belongsTo(AccesoComputo::class, 'acceso_computo_id');
    }
}

