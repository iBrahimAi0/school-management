<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceSessionRequest;
use App\Http\Requests\UpdateAttendanceSessionRequest;
use App\Http\Resources\AttendanceSessionResource;
use App\Models\AttendanceSession;
use Illuminate\Http\Request;

class AttendanceSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendanceSessions = AttendanceSession::with([
            'classe:id,name,code',
            'course:id,name',
            'teacher:id,first_name,last_name',
        ])
            ->latest()
            ->get();

        return response()->json([
            'attendanceSessions' => AttendanceSessionResource::collection($attendanceSessions),
            'message' => 'Attendance Sessions list sent successfully',
        ]);
    }

    public function teacherSessions($teacherId)
    {
        $teacherSessions = AttendanceSession::with([
            'classe:id,name,code',
            'course:id,name',
            'teacher:id,first_name,last_name',
        ])
            ->where('teacher_id', $teacherId)
            ->latest()
            ->get();

        return response()->json([
            'teacherSessions' => AttendanceSessionResource::collection($teacherSessions),
            'message' => 'Teacher Sessions list sent successfully',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceSessionRequest $request)
    {
        $data = $request->validated();
        $attendanceSession = new AttendanceSessionResource(AttendanceSession::create($data));
        return response()->json([
            'attendanceSession' => $attendanceSession,
            'message' => 'Attendance Session created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceSession $attendanceSession)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceSession $attendanceSession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceSessionRequest $request, AttendanceSession $attendanceSession)
    {
        $data = $request->validated();
        $attendanceSession->update($data);
        $attendanceSession->load(['classe', 'teacher', 'course']);
        return response()->json([
            'attendanceSession' => new AttendanceSessionResource($attendanceSession),
            'message' => 'Attendance Session updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceSession $attendanceSession)
    {
        $attendanceSession->delete();
        return response()->json([
            'attendanceSession' => $attendanceSession,
            'message' => 'Attendance Session deleted successfully'
        ]);
    }
}
