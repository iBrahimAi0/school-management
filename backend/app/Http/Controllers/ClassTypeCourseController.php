<?php

namespace App\Http\Controllers;

use App\Models\ClassTypeCourse;
use App\Http\Requests\StoreClassTypeCourseRequest;
use App\Http\Requests\UpdateClassTypeCourseRequest;
use App\Http\Resources\ClassTypeCourseResource;

class ClassTypeCourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classTypeCourses = ClassTypeCourse::with(['class_type:id,name,code', 'course:id,name'])->latest()->get();
        return response()->json([
            'classTypeCourses' => ClassTypeCourseResource::collection($classTypeCourses),
            'message' => 'Class Type Course List sent successfully'
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
    public function store(StoreClassTypeCourseRequest $request)
    {
        $data = $request->validated();
        $createdClassTypeCourse = new ClassTypeCourseResource(ClassTypeCourse::create($data));
        return response()->json([
            'classTypeCourse' => $createdClassTypeCourse,
            'message' => 'Class Type Course created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ClassTypeCourse $classTypeCourse)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassTypeCourse $classTypeCourse)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClassTypeCourseRequest $request, ClassTypeCourse $classTypeCourse)
    {
        $data = $request->validated();
        $classTypeCourse->update($data);
        $classTypeCourse->load(['class_type', 'course']);
        return response()->json([
            'classTypeCourse' => new ClassTypeCourseResource($classTypeCourse),
            'message' => 'Class Type Course updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassTypeCourse $classTypeCourse)
    {
        $classTypeCourse->delete();
        return response()->json([
            'classTypeCourse' => $classTypeCourse,
            'message' => 'Class Type Course deleted successfully'
        ]);
    }
}
