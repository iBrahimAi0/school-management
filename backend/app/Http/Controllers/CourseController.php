<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Classe;
use App\Models\User;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;
use App\Http\Resources\CourseResource;
use App\Http\Resources\StudentResource;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = CourseResource::collection(Course::latest()->get());
        return response()->json([
            'courses' => $courses,
            'message' => 'Courses sent successfully'
        ]);
    }
    public function teacherCourses($teacherId)
    {
        $courses = Course::with([
            'teachers:id,first_name,last_name'
        ])
            ->whereHas(
                'teachers',
                fn($query) =>
                $query->where('teachers.id', $teacherId)
            )
            ->latest()
            ->get();

        if ($courses->isEmpty()) {
            $classTypeIds = Classe::where('teacher_id', $teacherId)->pluck('class_type_id');
            if ($classTypeIds->isNotEmpty()) {
                $courses = Course::whereHas('classTypes', fn($q) => $q->whereIn('class_types.id', $classTypeIds))->latest()->get();
            }
        }

        if ($courses->isEmpty()) {
            $courses = Course::latest()->get();
        }

        return response()->json([
            'teacherCourses' => CourseResource::collection($courses),
            'message' => 'Teacher Courses sent successfully',
        ]);
    }
    public function teacherCourseStudents($teacherId, $courseId)
    {
        // Retrieve students registered in classes taught by this teacher that have this course
        $students = User::with(['classe:id,name,code', 'studentParent:id,first_name,last_name'])
            ->whereHas('classe', function ($query) use ($teacherId, $courseId) {
                $query->where('teacher_id', $teacherId)
                    ->whereHas('classType.courses', function ($q) use ($courseId) {
                        $q->where('courses.id', $courseId);
                    });
            })
            ->get();

        // Fallback: if class_type_courses mapping is not seeded, return students in this teacher's classes
        if ($students->isEmpty()) {
            $students = User::with(['classe:id,name,code', 'studentParent:id,first_name,last_name'])
                ->whereHas('classe', function ($query) use ($teacherId) {
                    $query->where('teacher_id', $teacherId);
                })
                ->get();
        }

        return response()->json([
            'teacherCourseStudents' => StudentResource::collection($students),
            'message' => 'Teacher Course Students sent successfully',
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {

        $course = new CourseResource(Course::create($request->validated()));
        return response()->json([
            'course' => $course,
            'message' => 'Course created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Course $course) {}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $data = $request->validated();
        $course->update($data);
        return response()->json([
            'course' => $course->refresh(),
            'message' => 'Course updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();
        return response()->json([
            'course' => new CourseResource($course),
            'message' => 'Course deleted successfully'
        ]);
    }
}
