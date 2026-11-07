<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClasseRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'min:3',
                'max:50',
            ],
            'code' => ['required', Rule::unique('classes', 'code')->ignore($this->route('classe')), 'min:4', 'max:20'],
            'class_type_id' => ['nullable', 'exists:class_types,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
        ];
    }
}
