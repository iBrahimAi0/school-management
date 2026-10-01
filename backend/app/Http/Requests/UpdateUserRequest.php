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
                Rule::unique('student_parents')
                    ->ignore($this->route('student')),
            ],

            'password' => [
                'nullable',
                'min:5',
                'max:50',
                'confirmed',
            ],
            'student_parent_id' => [
                'nullable',

            ],
        ];
    }
}
