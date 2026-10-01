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
            'parent' => $this->whenLoaded('studentParent', function () {
                return [
                    'id' => $this->studentParent->id,
                    'first_name' => $this->studentParent->first_name,
                    'last_name' => $this->studentParent->last_name,
                ];
            }),
            'updated_at' => $this->updated_at,

        ];
    }
}
