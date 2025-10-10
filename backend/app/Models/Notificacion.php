<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';

    protected $fillable = [
        'personal_id',
        'ultima_actualizacion',
    ];

    // Relación con la tabla 'personal'
    public function personal()
    {
        return $this->belongsTo(Personal::class, 'personal_id');
    }
}
