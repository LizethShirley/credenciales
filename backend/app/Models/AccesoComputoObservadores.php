<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccesoComputoObservadores extends Model
{
    protected $table = 'acceso_computo_observadores';

    protected $fillable = [
        'token_id',
        'observador_id',
        'asignado',
        'liberado',
    ];  

    public function token()
    {
        return $this->belongsTo(AccesoComputoExterno::class, 'token_id');
    }

    public function observador()
    {
        return $this->belongsTo(Observadores::class, 'observador_id');
    }
}
