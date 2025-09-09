<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActualizarObservadorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $observadorId = $this->route('id') ?? null;

        return [
            'nombre_completo' => 'sometimes|required|string|max:255',
            'ci' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('observadores', 'ci')->ignore($observadorId), // Ignora el CI del observador actual
            ],
            'identificador' => 'nullable|string|max:255',
            'organizacion_politica' => 'nullable|string|max:255',
            'foto' => 'nullable|file|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'ci.unique' => 'El número de CI ya está registrado en otro observador.',
        ];
    }
}

