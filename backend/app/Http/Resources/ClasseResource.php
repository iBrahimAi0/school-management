<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResource extends JsonResource
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
            'name' => $this->name,
            'code' => $this->code,
            'class_type' => $this->whenLoaded('classType'),
            'teacher_id' => $this->teacher_id,
            'teacher' => $this->whenLoaded('teacher'),
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
