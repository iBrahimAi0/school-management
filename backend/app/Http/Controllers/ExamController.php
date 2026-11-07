<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Exam::with([
            'classe:id,code,name',
            'course:id,name',
            'teacher:id,first_name,last_name',
        ])->latest();

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->query('teacher_id'));
        }

        $exams = $query->get();

        return response()->json([
            'exams' => ExamResource::collection($exams),
            'message' => 'exams list sent successfully'
        ]);
    }

    public function teacherExams($teacherId)
    {
        $exams = Exam::with([
            'classe:id,code,name',
            'course:id,name',
            'teacher:id,first_name,last_name',
        ])
            ->where(function ($query) use ($teacherId) {
                $query->where('teacher_id', $teacherId)
                    ->orWhereHas('classe', function ($q) use ($teacherId) {
                        $q->where('teacher_id', $teacherId);
                    });
            })
            ->latest()
            ->get();

        return response()->json([
            'teacherExams' => ExamResource::collection($exams),
            'message' => 'Teacher exams sent successfully'
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
    public function store(StoreExamRequest $request)
    {
        $data = $request->validated();

        $data['file_path'] = $request->file('file_path')->store('exams', 'public');


        // Create the exam
        $exam = Exam::create($data);
        return response()->json([
            'exam' => new ExamResource($exam),
            'message' => 'Exam created successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Exam $exam)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Exam $exam)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        $data = $request->validated();
        if ($request->hasFile('file_path')) {
            if ($exam->file_path && Storage::disk('public')->exists($exam->file_path)) {
                Storage::disk('public')->delete($exam->file_path);
            }

            $data['file_path'] = $request->file('file_path')->store('exams', 'public');
        } else {

            unset($data['file_path']);
        }

        $exam->update($data);

        $exam->load([
            'classe:id,code',
            'course:id,name',
            'teacher:id,first_name,last_name',
        ]);

        return response()->json([
            'exam' => new ExamResource($exam),
            'message' => 'Exam updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        if ($exam->file_path && Storage::disk('public')->exists($exam->file_path)) {
            Storage::disk('public')->delete($exam->file_path);
        }
        $exam->delete();
        return response()->json([
            'exam' => $exam,
            'message' => 'Exam deleted successfully'
        ]);
    }


    public function showFile($id)
    {
        $exam = Exam::findOrFail($id);

        if (!$exam->file_path) {
            return response()->json(['message' => 'No file associated with this exam.'], 404);
        }

        // 1. Check in 'public' disk (storage/app/public/...)
        if (Storage::disk('public')->exists($exam->file_path)) {
            return response()->file(Storage::disk('public')->path($exam->file_path));
        }

        // 2. Check in default 'local' disk (storage/app/...)
        if (Storage::disk('local')->exists($exam->file_path)) {
            return response()->file(Storage::disk('local')->path($exam->file_path));
        }

        // 3. Fallback error if the file was deleted or path is broken
        return response()->json([
            'message'   => 'File not found on disk',
            'file_path' => $exam->file_path,
        ], 404);
    }
}
