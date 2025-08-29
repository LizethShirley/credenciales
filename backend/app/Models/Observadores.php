<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class Observadores extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'observadores';

    protected $fillable = [
        'nombre_completo',
        'ci',
        'foto',
        'identificador',
        'organizacion_politica',
    ];

    /**
     * Devuelve la URL completa de la imagen
     */
    public function getPhotoBase64Attribute()
    {
        return $this->foto ? 'data:image/jpeg;base64,' . base64_encode($this->foto) : null;
    }
}
