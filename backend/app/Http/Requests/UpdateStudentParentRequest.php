<?php

namespace App\Http\Requests;

use App\Enums\BloodEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentParentRequest extends FormRequest
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
        $parentId = $this->route('studentParent')?->id ?? $this->route('studentParent') ?? $this->id;

        return [
            'first_name' => [
                'required',
                'min:2',
                'max:50',
            ],

            'last_name' => [
                'required',
                'min:2',
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

            'address' => [
                'required',
                'max:255',
            ],

            'phone' => [
                'required',
                'string',
                'max:25',
                Rule::unique('student_parents', 'phone')->ignore($parentId),
            ],

            'email' => [
                'required',
                'string',
                'email',
                Rule::unique('student_parents', 'email')->ignore($parentId),
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
