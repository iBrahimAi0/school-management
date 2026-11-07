<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Exam;
use App\Models\ExamRecord;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentPortalController extends Controller
{
    public function getPortalData(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $student = User::with([
            'classe.classType.courses.teachers',
            'classe.teacher',
            'studentParent'
        ])->find($user->id);

        if (!$student) {
            return response()->json(['error' => 'Student not found'], 404);
        }

        $courses = $student->classe?->classType?->courses ?? [];

        $attendanceRecords = AttendanceRecord::where('user_id', $student->id)
            ->with(['attendanceSession.course', 'attendanceSession.classe'])
            ->latest()
            ->get();

        $examRecords = ExamRecord::where('user_id', $student->id)
            ->with(['exam.course', 'exam.classe'])
            ->latest()
            ->get();

        $exams = $student->classe_id
            ? Exam::where('classe_id', $student->classe_id)->with(['course', 'teacher'])->latest()->get()
            : [];

        return response()->json([
            'student' => $student,
            'classe' => $student->classe,
            'courses' => $courses,
            'attendanceRecords' => $attendanceRecords,
            'examRecords' => $examRecords,
            'exams' => $exams,
        ]);
    }
}
