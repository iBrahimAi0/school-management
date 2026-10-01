<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceRecordResource extends JsonResource
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
            'attendance_session' => $this->whenLoaded('attendance_session'),
            'student' => $this->whenLoaded('student'),
            'status' => $this->status,
            'updated_at' => $this->updated_at?->toISOString(),

        ];
    }
}
