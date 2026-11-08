<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentParentRequest;
use App\Http\Requests\UpdateStudentParentRequest;
use App\Http\Resources\StudentParentResource;
use App\Models\StudentParent;
use App\Models\User;
use Illuminate\Http\Request;
use DateTime;
use Illuminate\Support\Facades\Hash;

class StudentParentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return StudentParentResource::collection(
            StudentParent::with(['students:id,first_name,last_name,email,student_parent_id,classe_id'])
                ->withCount('students')
                ->latest()
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentParentRequest $request)
    {
        $formFields = $request->validated();

        $formFields['password'] = Hash::make($formFields['password']);
        $formFields['last_login_date'] = now();

        $parent = StudentParent::create([
            'first_name' => $formFields['first_name'],
            'last_name' => $formFields['last_name'],
            'last_login_date' => $formFields['last_login_date'],
            'date_of_birth' => $formFields['date_of_birth'],
            'gender' => $formFields['gender'],
            'blood_type' => $formFields['blood_type'],
            'address' => $formFields['address'],
            'phone' => $formFields['phone'],
            'email' => $formFields['email'],
            'password' => $formFields['password'],
        ]);

        return response()->json([
            'parent' => $parent,
            'message' => 'Parent Created Successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(StudentParent $studentParent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateStudentParentRequest $request,
        StudentParent $studentParent
    ) {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $studentParent->update($data);

        return response()->json([
            'parent' => $studentParent->fresh(),
            'message' => 'Parent Updated Successfully'

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StudentParent $studentParent)
    {
        $studentParent->delete();

        return new StudentParentResource($studentParent);
    }

    public function children(StudentParent $studentParent)
    {
        $children = User::where('student_parent_id', $studentParent->id)
            ->with(['classe:id,name,code'])
            ->latest()
            ->get();

        return response()->json([
            'children' => $children,
            'message' => 'Parent children retrieved successfully'
        ]);
    }

    public function assignStudent(Request $request, StudentParent $studentParent)
    {
        $data = $request->validate([
            'student_id' => 'required|integer|exists:users,id',
        ]);

        $student = User::findOrFail($data['student_id']);
        $student->update(['student_parent_id' => $studentParent->id]);
        $student->load(['classe:id,name,code', 'studentParent:id,first_name,last_name']);

        return response()->json([
            'student' => $student,
            'message' => "Student {$student->first_name} {$student->last_name} assigned successfully"
        ]);
    }

    public function unassignStudent(StudentParent $studentParent, User $student)
    {
        if ($student->student_parent_id === $studentParent->id) {
            $student->update(['student_parent_id' => null]);
        }

        return response()->json([
            'message' => 'Student unassigned from parent successfully'
        ]);
    }
}
