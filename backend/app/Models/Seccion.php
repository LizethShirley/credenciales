<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Seccion extends Model
{
    protected $table = 'secciones';

    protected $fillable = [
        'nombre',
        'abreviatura',
        'estado'
    ];

    public function cargos()
    {
        return $this->hasMany(Cargo::class, 'idseccion');

    }
}
