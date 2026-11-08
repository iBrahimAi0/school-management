<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'last_login_date' => $this->last_login_date,
            'gender' => $this->gender,
            'email' => $this->email,
            'blood_type' => $this->blood_type,
            'student_parent_id' => $this->student_parent_id,
            'classe_id' => $this->classe_id,
            'parent' => $this->studentParent ? [
                'id' => $this->studentParent->id,
                'first_name' => $this->studentParent->first_name,
                'last_name' => $this->studentParent->last_name,
            ] : null,
            'student_parent' => $this->studentParent ? [
                'id' => $this->studentParent->id,
                'first_name' => $this->studentParent->first_name,
                'last_name' => $this->studentParent->last_name,
            ] : null,
            'classe' => $this->classe ? [
                'id' => $this->classe->id,
                'name' => $this->classe->name,
                'code' => $this->classe->code,
            ] : null,
            'updated_at' => $this->updated_at,

        ];
    }
}
