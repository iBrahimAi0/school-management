<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreClassTypeCourseRequest extends FormRequest
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
            'class_type_id' => ['required', 'integer', 'exists:class_types,id'],
            'course_id' => ['required', 'integer', 'exists:courses,id'],
            'coef' => [
                'required',
                'numeric',
                'min:0',
                'max:20',
            ],
        ];
    }
}
