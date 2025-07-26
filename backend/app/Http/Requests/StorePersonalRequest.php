<?php

namespace App\Http\Requests;

use App\Models\Cargo;
use Illuminate\Foundation\Http\FormRequest;

class StorePersonalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'nombre' => 'required|string|max:255',
            'paterno' => 'nullable|string|max:60',
            'materno' => 'nullable|string|max:56',
            'ci' => 'required|string|max:25',
            'complemento' => 'nullable|string|max:5',
            'extencion' => 'nullable|string|max:25',
            'email' => 'nullable|email|max:255',
            'celular' => 'required|digits_between:7,11',
            'id_cargo' => 'required|exists:cargos,id',
            'id_recinto' => ['nullable'],
            'estado' => 'required|integer|in:0,1',
            'accesoComputo' => 'nullable|integer|in:0,1',
            'ciexterno' => 'nullable|string|max:45',
            'photo' => 'nullable|image',
            'token' => 'required',
        ];

        return $rules;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'estado' => $this->input('estado', '0'),
        ]);
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $expectedToken = env('TOKEN_REGISTRO');

            if ($this->token !== $expectedToken) {
                $validator->errors()->add('token', 'El código de verificación es incorrecto.');
            }
        });
    }
}

