<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\AccesoComputoExterno;

class ActualizarObservadorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        $observadorCI = $this->input('ci');
        $rules = [
            'nombre_completo' => 'required|string|max:255',
            'ci' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('observadores', 'ci')->ignore($observadorCI, 'ci'),
            ],
            'foto' => 'nullable|file|image|max:2048',
            'identificador' => 'nullable|string|max:255',
            'organizacion_politica' => 'nullable|string|max:255'
        ];

        $tokenInput = $this->route('token');

        if ($tokenInput) {
            $tipoToken = AccesoComputoExterno::where('token_acceso', $tokenInput)->value('tipo');

            if ($tipoToken === 'prensa') {
                $rules['identificador'] = 'required|string|max:255';
            }

            if (in_array($tipoToken, ['delegado', 'candidato'])) {
                $rules['organizacion_politica'] = 'required|string|max:255';
            }
        }

        return $rules;
    }
    
    public function messages(): array
    {
        return [
            'ci.unique' => 'El número de CI ya está registrado en otro observador.',
        ];
    }
}

