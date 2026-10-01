<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamRequest extends FormRequest
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
            'name' => ['required', 'min:3', 'max:50'],
            'type' => Rule::in(['cc', 'efm']),
            'file_path'  => [
                'required',
                'file',
                'mimes:pdf,doc,docx',
                'max:10240', // 10MB (in kilobytes)
            ],
            'teacher_id' => ['required', 'exists:teachers,id'],
            'course_id'  => ['required', 'exists:courses,id'],
            'classe_id'  => ['required', 'exists:classes,id'],
        ];
    }
}
