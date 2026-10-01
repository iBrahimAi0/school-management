<?php

namespace App\Http\Controllers;

use App\Models\ExamRecord;
use App\Http\Requests\StoreExamRecordRequest;
use App\Http\Requests\UpdateExamRecordRequest;
use App\Http\Resources\ExamRecordResource;

class ExamRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $examRecords = ExamRecord::with(['student:id,first_name,last_name', 'exam:id,name'])->latest()->get();
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
        $createdExamRecord = new ExamRecordResource(ExamRecord::create($data));

        return response()->json([
            'examRecord' => $createdExamRecord,
            'message' => 'Exam Record created successfully'
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
