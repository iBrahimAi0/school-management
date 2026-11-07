<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreExamRecordRequest extends FormRequest
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
            'exam_id' => [
                'required',
                'integer',
                'exists:exams,id',
            ],

            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
            ],

            'note' => [
                'required',
                'numeric',
                'min:0',
                'max:20',
            ],

            'comment' => [
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }
}
