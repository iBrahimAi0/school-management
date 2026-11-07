<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Exam;
use App\Models\ExamRecord;
use App\Models\StudentParent;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ParentPortalController extends Controller
{
    public function getPortalData(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $parent = StudentParent::find($user->id);
        if (!$parent) {
            return response()->json(['error' => 'Parent not found'], 404);
        }

        $children = User::where('student_parent_id', $parent->id)
            ->with([
                'classe.classType.courses.teachers',
                'classe.teacher'
            ])
            ->get();

        $childrenIds = $children->pluck('id')->toArray();
        $classeIds = $children->pluck('classe_id')->filter()->toArray();

        $attendanceRecords = AttendanceRecord::whereIn('user_id', $childrenIds)
            ->with(['attendanceSession.course', 'attendanceSession.classe', 'student:id,first_name,last_name'])
            ->latest()
            ->get();

        $examRecords = ExamRecord::whereIn('user_id', $childrenIds)
            ->with(['exam.course', 'exam.classe', 'student:id,first_name,last_name'])
            ->latest()
            ->get();

        $exams = count($classeIds) > 0
            ? Exam::whereIn('classe_id', $classeIds)->with(['course', 'classe', 'teacher'])->latest()->get()
            : [];

        return response()->json([
            'parent' => $parent,
            'children' => $children,
            'attendanceRecords' => $attendanceRecords,
            'examRecords' => $examRecords,
            'exams' => $exams,
        ]);
    }
}
