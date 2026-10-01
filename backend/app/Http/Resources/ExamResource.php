<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ExamResource extends JsonResource
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
            'type' => $this->type,
            'file_path'  => $this->file_path,
            'teacher' => $this->whenLoaded('teacher'),
            'course' => $this->whenLoaded('course'),
            'classe' => $this->whenLoaded('classe'),
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
