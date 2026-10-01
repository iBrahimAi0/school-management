<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\StudentResource;
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
