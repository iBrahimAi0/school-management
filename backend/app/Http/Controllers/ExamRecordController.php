<?php

namespace App\Http\Controllers;

use App\Models\ExamRecord;
use App\Http\Requests\StoreExamRecordRequest;
use App\Http\Requests\UpdateExamRecordRequest;
use App\Http\Resources\ExamRecordResource;
use Illuminate\Http\Request;

class ExamRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ExamRecord::with(['student:id,first_name,last_name', 'exam:id,name'])->latest();

        if ($request->filled('exam_id')) {
            $query->where('exam_id', $request->query('exam_id'));
        }

        $examRecords = $query->get();

        return response()->json([
            'examRecords' => ExamRecordResource::collection($examRecords),
            'message' => 'Exam Records list sent successfully',
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
    public function store(StoreExamRecordRequest $request)
    {
        $data = $request->validated();
        $createdExamRecord = ExamRecord::updateOrCreate(
            [
                'exam_id' => $data['exam_id'],
                'user_id' => $data['user_id'],
            ],
            [
                'note' => $data['note'],
                'comment' => !empty($data['comment']) ? $data['comment'] : null,
            ]
        );
        $createdExamRecord->load(['student:id,first_name,last_name', 'exam:id,name']);

        return response()->json([
            'examRecord' => new ExamRecordResource($createdExamRecord),
            'message' => 'Exam Record saved successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ExamRecord $examRecord)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ExamRecord $examRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateExamRecordRequest $request, ExamRecord $examRecord)
    {
        $data = $request->validated();
        if (array_key_exists('comment', $data) && empty($data['comment'])) {
            $data['comment'] = null;
        }
        $examRecord->update($data);
        $examRecord->load([
            'student:id,first_name,last_name',
            'exam:id,name',
        ]);
        return response()->json([
            'examRecord' => $examRecord->refresh(),
            'message' => 'Exam Record updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ExamRecord $examRecord)
    {
        $examRecord->delete();
        return response()->json([
            'examRecord' => $examRecord,
            'message' => 'Exam Record deleted successfully'
        ]);
    }
}
