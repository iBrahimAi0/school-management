<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentParentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'date_of_birth' => $this->date_of_birth?->format('Y-m-d'),
            'gender' => $this->gender,
            'blood_type' => $this->blood_type,
            'address' => $this->address,
            'phone' => $this->phone,
            'email' => $this->email,
            'students_count' => $this->students_count ?? $this->students()->count(),
            'students' => $this->relationLoaded('students')
                ? $this->students->map(fn($s) => [
                    'id' => $s->id,
                    'first_name' => $s->first_name,
                    'last_name' => $s->last_name,
                    'email' => $s->email,
                ])
                : [],
            'last_login_date' => $this->last_login_date,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
