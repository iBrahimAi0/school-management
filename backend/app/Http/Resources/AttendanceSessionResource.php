<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceSessionResource extends JsonResource
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
            'classe' => $this->whenLoaded('classe'),
            'course' => $this->whenLoaded('course'),
            'teacher' => $this->whenLoaded('teacher'),
            'date' => $this->date,
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
