<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Http\Resources\TeacherResource;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $teachers = TeacherResource::collection(Teacher::all());
        return response()->json([
            "teachers" => $teachers,
            "message" => "Teachers List sent successfully"
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
    public function store(StoreTeacherRequest $request)
    {
        $formFields = $request->validated();
        $formFields['password'] = Hash::make($formFields['password']);
        $teacher = Teacher::create($formFields);
        return response()->json([
            "teacher" => $teacher,
            "message" => "Teacher Created Successfully"
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher)
    {
        $data = $request->validated();
        //*
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $teacher->update($data);


        return response()->json([
            'teacher' => $teacher->fresh(),
            'message' => 'Teacher Updated Successfully'

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Teacher $teacher)
    {
        $teacher->delete();
        return response()->json([
            "teacher" => new TeacherResource($teacher),
            "message" => "Teacher Deleted Successfully",
        ]);
    }
}
