<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCargoRequest extends FormRequest
{

    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'nombre' => 'required|string|max:150|unique:cargos,nombre',
            'color' => 'required|string',
            'estado' => 'required|integer',
            'idseccion' => 'required|integer|exists:secciones,id',
        ];
    }
}
