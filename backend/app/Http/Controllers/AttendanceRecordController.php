<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRecordRequest;
use App\Http\Requests\UpdateAttendanceRecordRequest;
use App\Http\Resources\AttendanceRecordResource;
use App\Models\AttendanceRecord;
use Illuminate\Http\Request;

class AttendanceRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AttendanceRecord::with([
            'student',
            'attendanceSession.course',
        ]);

        if ($request->filled('session_id')) {
            $query->where('attendance_session_id', $request->query('session_id'));
        }

        $attendanceRecords = $query->get();

        return response()->json([
            'attendanceRecords' => AttendanceRecordResource::collection($attendanceRecords),
            'message' => 'Attendance Record List sent successfully'
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
    public function store(StoreAttendanceRecordRequest $request)
    {
        $data = $request->validated();
        $attendanceRecord = AttendanceRecord::updateOrCreate(
            [
                'attendance_session_id' => $data['attendance_session_id'],
                'user_id' => $data['user_id'],
            ],
            [
                'status' => $data['status'],
            ]
        );
        $attendanceRecord->load(['student', 'attendanceSession.course']);
        return response()->json([
            'attendanceRecord' => new AttendanceRecordResource($attendanceRecord),
            'message' => 'Attendance Record saved successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceRecord $attendanceRecord)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceRecord $attendanceRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRecordRequest $request, AttendanceRecord $attendanceRecord)
    {
        $data = $request->validated();
        $attendanceRecord->update($data);
        $attendanceRecord->load(['student', 'attendanceSession']);
        return response()->json([
            'attendanceRecord' => new AttendanceRecordResource($attendanceRecord),
            'message' => 'Attendance Record updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceRecord $attendanceRecord)
    {
        $attendanceRecord->delete();
        return response()->json([
            'attendanceRecord' => $attendanceRecord,
            'message' => 'Attendance Record deleted successfully'
        ]);
    }
}
