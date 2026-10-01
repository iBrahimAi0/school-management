<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ExamRecordResource extends JsonResource
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
            'exam' => $this->whenLoaded('exam'),
            'student' => $this->whenLoaded('student'),
            'note'  => $this->note,
            'comment' => $this->comment,
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
