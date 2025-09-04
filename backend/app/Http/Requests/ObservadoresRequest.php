<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ObservadoresRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre_completo' => 'required|string|max:255',
            'ci' => 'nullable|string|max:255',
            'photo' => 'nullable|image|max:2048',
            'identificador' => 'nullable|string|max:255',
            'organizacion_politica' => 'nullable|string|max:255',
        ];
    }
}
