<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recinto extends Model
{
    use HasFactory;

    protected $table = 'recintos';

    protected $fillable = [
        'codigoMesa',
        'codigoActa',
        'numMesa',
        'numeroMesa',
        'idPais',
        'nomPais',
        'dep',
        'nombreDepartamento',
        'prov',
        'nombreProvincia',
        'circun',
        'nomCircun',
        'sec',
        'nombreMunicipio',
        'codigoLocalidad',
        'nombreLocalidad',
        'dist',
        'nomDist',
        'zona',
        'nomZona',
        'codigoRecinto',
        'nombreRecinto',
        'ciNotE',
        'nomNotE',
        'inscritosHabilitados',
        'idTipoMesa',
        'idEstadoMesaGeografia',
        'fechaRegistro',
        'estadoRegistro',
        'observaciones',

    ];
}
