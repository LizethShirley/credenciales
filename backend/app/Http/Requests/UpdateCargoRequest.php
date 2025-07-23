<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCargoRequest extends FormRequest
{
    /**
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules()
    {
        $cargoId = $this->route('cargo');

        return [
            'nombre' => [
                'required',
                'string',
                'max:150',
                Rule::unique('cargos', 'nombre')->ignore($cargoId),
            ],
            'color' => 'required|string',
            'estado' => 'required|integer',
            'idseccion' => 'required|integer|exists:secciones,id',
        ];
    }
}
