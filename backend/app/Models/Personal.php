<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Personal extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'personal';

    protected $fillable = [
        'nombre',
        'paterno',
        'materno',
        'photo',
        'id_cargo',
        'ci',
        'estado',
        'complemento',
        'extencion',
        'id_recinto',
        'token',
        'email',
        'celular',
        'accesoComputo',
        'ciexterno',
    ];

//    protected $hidden = [
//        'password',
//        'remember_token',
//    ];
//
//    protected $casts = [
//        'email_verified_at' => 'datetime',
//    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function recinto()
    {
        return $this->belongsTo(Recinto::class, 'id_recinto');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cargoData()
    {
        return $this->belongsTo(Cargo::class, 'id_cargo');
    }

    /**
     * Devuelve la URL completa de la imagen
     */
    public function getPhotoBase64Attribute()
    {
        return $this->photo ? 'data:image/jpeg;base64,' . base64_encode($this->photo) : null;
    }
}

