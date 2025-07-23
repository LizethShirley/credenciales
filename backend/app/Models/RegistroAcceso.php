<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroAcceso extends Model
{
    use HasFactory;

    protected $table = 'registro_accesos';

    protected $fillable = [
        'personal_id',
        'fecha_hora',
        'tipo',
        'observacion',
    ];

    /**
     * Relación con el modelo Personal.
     */
    public function accesoComputo()
    {
        return $this->belongsTo(AccesoComputo::class, 'acceso_computo_id');
    }
}

