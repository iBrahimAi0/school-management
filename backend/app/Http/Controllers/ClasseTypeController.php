<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Http\Requests\StoreClasseTypeRequest;
use App\Http\Requests\UpdateClasseTypeRequest;
use App\Http\Resources\ClasseTypeResource;
use App\Models\ClassType;

class ClasseTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classTypes = ClasseTypeResource::collection(ClassType::latest()->get());
        return response()->json([
            'classTypes' => $classTypes,
            'message' => 'Class Types List has been sent successfully'
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
    public function store(StoreClasseTypeRequest $request)
    {


        $classType = ClassType::create($request->validated());

        return response()->json([
            'classType' => new ClasseTypeResource($classType),
            'message' => 'Class Type Created Successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(ClassType $classe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ClassType $classe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClasseTypeRequest $request, ClassType $classType)
    {
        $updatedClasseType = $request->validated();

        $classType->update($updatedClasseType);
        return response()->json([
            'classType' => $classType->refresh(),
            'message' => 'Classe Type Updated Successfuly'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClassType $classType)
    {
        $classType->delete();
        return response()->json([
            "classType" => new ClasseTypeResource($classType),
            "message" => "Teacher Deleted Successfully",
        ]);
    }
}
