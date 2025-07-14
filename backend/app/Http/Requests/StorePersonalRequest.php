<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePersonalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'paterno' => 'required|string|max:60',
            'materno' => 'required|string|max:56',
            'ci' => 'required|string|max:25',
            'complemento' => 'nullable|string|max:5',
            'extencion' => 'required|string|max:25',
            'email' => 'nullable|email|max:255',
            'celular' => 'nullable|digits_between:7,11',
            'id_cargo' => 'required|exists:cargos,id',
            'id_recinto' => [
                'nullable',
                'exists:recintos,id',
                function ($attribute, $value, $fail) {
                    $cargoNombre = optional(\App\Models\Cargo::find($this->id_cargo))->nombre;
                    if ($cargoNombre && strtolower($cargoNombre) === 'notario' && !$value) {
                        $fail('El campo id_recinto es obligatorio cuando el cargo es Notario.');
                    }
                }
            ],
            'token' => 'required',
            'estado' => 'required|integer|in:0,1',
            'accesoComputo' => 'nullable|integer|in:0,1',
            'ciexterno' => 'nullable|string|max:45',
            'photo' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ];
    }
}
