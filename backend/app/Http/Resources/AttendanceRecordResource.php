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
            'attendance_session_id' => $this->attendance_session_id,
            'user_id' => $this->user_id,
            'attendance_session' => $this->whenLoaded(
                'attendanceSession',
                fn() => [
                    'id' => $this->attendanceSession->id,
                    'date' => $this->attendanceSession->date,
                    'course' => $this->attendanceSession->course?->name,
                ]
            ),
            'student' => $this->whenLoaded('student'),
            'status' => $this->status,
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
