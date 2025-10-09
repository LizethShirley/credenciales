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
            'id' => 'required|exists:observadores,id',
            'nombre_completo' => 'required|string|max:255',
            'ci' => 'sometimes|required|string|max:50',
            'foto' => 'nullable|file|image|max:2048',
            'identificador' => 'nullable|string|max:255',
            'organizacion_politica' => 'nullable|string|max:255'
        ];

        $tokenInput = $this->route('token');

        if ($tokenInput) {
            $tokenModel = AccesoComputoExterno::where('token_acceso', $tokenInput)->first();
            if (!$tokenModel) {
                return $rules;
            }
            $tipoToken = $tokenModel ? $tokenModel->value('tipo') : null;

            if ($tipoToken === null) {
                return $rules;
            }

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

