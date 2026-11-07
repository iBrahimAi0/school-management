<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Http\Requests\StoreClasseRequest;
use App\Http\Requests\UpdateClasseRequest;
use App\Http\Resources\ClasseResource;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = Classe::with(['classType:id,name', 'teacher:id,first_name,last_name'])->latest()->get();
        return response()->json([
            'classes' => ClasseResource::collection($classes),
            'message' => 'Classes List has been sent successfully'
        ]);
    }



    public function teacherClasses($teacherId)
    {
        $teacherClasses = Classe::with(['classType:id,name'])
            ->where('teacher_id', $teacherId)
            ->get();
        return response()->json([
            'teacherClasses' => ClasseResource::collection($teacherClasses),
            'message' => 'Teacher classes List has been sent successfully'
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
    public function store(StoreClasseRequest $request)
    {

        $formFields = $request->validated();



        $class = Classe::create($formFields);

        return response()->json([
            'classe' => $class,
            'message' => 'Class Created Successfully'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Classe $classe)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Classe $classe)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateClasseRequest $request, Classe $classe)
    {


        $classe->update($request->validated());
        $classe->load(['classType:id,name', 'teacher:id,first_name,last_name']);
        return response()->json([
            'classe' => $classe->refresh(),
            'message' => 'Classe Updated Successfuly'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classe $classe)
    {
        $classe->delete();

        return response()->json([
            'classe' => new ClasseResource($classe),
            'message' => 'Classe Deleted Successfully'
        ]);
    }
}
