<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recinto extends Model
{
    use HasFactory;

    protected $table = 'recintos';

    protected $fillable = [
        'CodigoMesa',
        'CodigoActa',
        'NumMesa',
        'NumeroMesa',
        'IdPais',
        'NomPais',
        'Dep',
        'NombreDepartamento',
        'Prov',
        'NombreProvincia',
        'Circun',
        'NomCircun',
        'Sec',
        'NombreMunicipio',
        'CodigoLocalidad',
        'NombreLocalidad',
        'Dist',
        'NomDist',
        'Zona',
        'NomZona',
        'CodigoRecinto',
        'NombreRecinto',
        'CINotE',
        'NomNotE',
        'InscritosHabilitados',
        'IdTipoMesa',
        'IdEstadoMesaGeografia',
        'FechaRegistro',
        'EstadoRegistro',
        'Observaciones',
    ];
}
