<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccesoComputo extends Model
{
    use HasFactory;

    protected $table = 'acceso_computo';

    protected $fillable = [
        'personal_id',
        'token_acceso',
        'qr',
        'activo',
    ];

    /**
     * Relación con el modelo Personal.
     */
    public function personal()
    {
        return $this->belongsTo(Personal::class, 'personal_id');
    }
}
