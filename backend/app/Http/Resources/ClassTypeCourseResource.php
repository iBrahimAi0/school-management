<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassTypeCourseResource extends JsonResource
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
            'class_type' => $this->whenLoaded('class_type'),
            'course' => $this->whenLoaded('course'),
            'coef' => $this->coef,
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
