<?php

namespace App\Http\Requests;

use App\Enums\BloodEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTeacherRequest extends FormRequest
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
                Rule::unique('teachers', 'email')
                    ->ignore($this->route('teacher')),
            ],

            'password' => [
                'nullable',
                'min:5',
                'max:50',
                'confirmed',
            ],
        ];
    }
}
