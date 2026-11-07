<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StudentResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = User::with(['studentParent:id,first_name,last_name'])->latest()->get();
        return response()->json([
            'students' => $students,
            'message' => 'Students List Sent Successfully'
        ]);
    }

    public function teacherStudentsClasse($teacherId, $classeId)
    {
        $students = User::with(['classe:id,name,code', 'studentParent:id,first_name,last_name'])
            ->where('classe_id', $classeId)
            ->whereHas('classe', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->get();

        return response()->json([
            'teacherStudentsClasse' => StudentResource::collection($students),
            'message' => 'Teacher Students by Classe List has been sent successfully'
        ]);
    }

    public function teacherStudents($teacherId)
    {
        $students = User::with(['classe:id,name,code', 'studentParent:id,first_name,last_name'])
            ->whereHas('classe', function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId);
            })
            ->get();

        return response()->json([
            'teacherStudents' => StudentResource::collection($students),
            'message' => 'Teacher Students List has been sent successfully'
        ]);
    }
    /* public function StudentsRecord($classId)
    {
        $studentsByClasse = User::with(['classe:*'])->whereHas('classe', function ($query) use ($classId) {
            $query->where('classe_id', $classId);
        })->get();


        return response()->json([
            'studentsByClasse' => StudentResource::collection($studentsByClasse),
            'message' => 'Student List has been sent successfully'
        ]);
    } */


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $formFields = $request->validated();

        $formFields['password'] = Hash::make($formFields['password']);
        $formFields['last_login_date'] = now();

        $student = User::create($formFields);

        return response()->json([
            'student' => $student,
            'message' => 'Student Created Successfully'
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $student)
    {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $student->update($data);

        $student->refresh()->load(['studentParent:id,first_name,last_name']);

        return response()->json([
            'student' => $student,
            'message' => 'Student Updated Successfully'

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $student)
    {
        $student->delete();

        return new StudentResource($student);
    }
}
