<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\AccesoComputoExterno;

class ActivarAccesoComputoExternoRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $rules = [
            // 'token' => 'required|string|max:255|exists:acceso_computo_externo,token_acceso,activo,0',
            'nombre_completo' => 'required|string|max:255',
            'ci' => 'nullable|string|max:50|unique:observadores,ci',
            'foto' => 'nullable|file|image|max:2048',
            // 'identificador' => 'nullable|string|max:255',
            // 'organizacion_politica' => 'nullable|string|max:255',
        ];

        // $tokenInput = $this->input('token');
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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $tokenInput = $this->route('token');
            $tokenValido = AccesoComputoExterno::where('token_acceso', $tokenInput)
                ->where('activo', 0)
                ->exists();

            if (!$tokenValido) {
                $validator->errors()->add('token', 'El token no es válido o ya fue usado.');
            }
        });
    }
}
