<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSeccionRequest extends FormRequest
{
    /**
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'nombre' => [
                'required',
                'string',
                'max:200',
                Rule::unique('secciones', 'nombre')->ignore($this->seccion)
            ],
            'abreviatura' => [
                'required',
                'string',
                'max:5',
                Rule::unique('secciones', 'abreviatura')->ignore($this->seccion)
            ],
            'estado' => 'required|integer',
        ];
    }
}
