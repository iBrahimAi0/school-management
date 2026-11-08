<?php

namespace App\Http\Requests;

use App\Enums\BloodEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => [
                'required',
                'min:3',
                'max:50',
            ],

            'last_name' => [
                'required',
                'min:3',
                'max:50',
            ],

            'date_of_birth' => [
                'required',
                'date',
            ],

            'gender' => [
                'required',
                Rule::in(['m', 'f']),
            ],

            'blood_type' => [
                'required',
                Rule::enum(BloodEnum::class),
            ],

            'email' => [
                'required',
                'string',
                'email',
                Rule::unique('users')
                    ->ignore($this->route('student')?->id ?? $this->route('student')),
            ],

            'password' => [
                'nullable',
                'min:5',
                'max:50',
                'confirmed',
            ],
            'student_parent_id' => [
                'nullable',
                'exists:student_parents,id',
            ],
            'classe_id' => [
                'nullable',
                'exists:classes,id',
            ],
        ];
    }
}
