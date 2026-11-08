<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Enums\BloodEnum;
use Illuminate\Validation\Rule  ;

class StoreStudentParentRequest extends FormRequest
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
            'first_name' => 'required|min:2|max:50',

            'last_name' => 'required|min:2|max:50',

            'date_of_birth' => 'required|date',

            'gender' => [
                'required',
                Rule::in(['m', 'f']),
            ],

            'blood_type' => [
                'required',
                Rule::enum(BloodEnum::class),
            ],

            'address' => 'required|max:255',

            'phone' => 'required|string|max:25|unique:student_parents,phone',

            'email' => 'required|string|email|unique:student_parents,email',

            'password' => 'required|min:5|max:50|confirmed',
        ];
    }
}
