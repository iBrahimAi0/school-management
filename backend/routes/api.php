<?php

use App\Http\Controllers\Api\MultiAuthController;
use App\Http\Controllers\AttendanceRecordController;
use App\Http\Controllers\AttendanceSessionController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ClasseTypeController;
use App\Http\Controllers\ClassTypeCourseController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\ExamRecordController;
use App\Http\Controllers\ParentPortalController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentParentController;
use App\Http\Controllers\StudentPortalController;
use App\Http\Controllers\TeacherController;
use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use Illuminate\Support\Facades\Route;

// Public auth endpoints
Route::post('/login', [MultiAuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [
    MultiAuthController::class,
    'logout',
]);

Route::middleware('auth:sanctum')
    ->get('/user', [MultiAuthController::class, 'me']);


// Admin Route Group
Route::middleware(['auth:sanctum', 'abilities:dashboard:view'])
    ->prefix('admin')
    ->group(function () {
        Route::get('/dashboard-data', function () {
            return response()->json([
                'data' => 'Admin Secret Metrics',
            ]);
        });
    });


// Teacher Route Group
Route::middleware(['auth:sanctum', 'abilities:dashboard:view'])
    ->prefix('teacher')
    ->group(function () {
        Route::get('/dashboard-data', function () {
            return response()->json([
                'data' => 'Teacher Classes',
            ]);
        });
    });

// Parent Route Group
Route::middleware(['auth:sanctum', 'abilities:dashboard:view'])
    ->prefix('parent')
    ->group(function () {
        Route::get('/dashboard-data', function () {
            return response()->json([
                'data' => 'Parent View',
            ]);
        });
        Route::get('/portal-data', [ParentPortalController::class, 'getPortalData']);
    });

// Student Route Group
Route::middleware(['auth:sanctum', 'abilities:dashboard:view'])
    ->prefix('student')
    ->group(function () {
        Route::get('/dashboard-data', function () {
            return response()->json([
                'data' => 'Student Grades',
            ]);
        });
        Route::get('/portal-data', [StudentPortalController::class, 'getPortalData']);
    });

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/parents', [StudentParentController::class, 'index'])
        ->middleware('abilities:parents:read');

    Route::post('/parents', [StudentParentController::class, 'store'])
        ->middleware('abilities:parents:create');

    Route::put('/parents/{studentParent}', [StudentParentController::class, 'update'])
        ->middleware('abilities:parents:update');

    Route::delete('/parents/{studentParent}', [StudentParentController::class, 'destroy'])
        ->middleware('abilities:parents:delete');
});


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/students', [StudentController::class, 'index'])
        ->middleware('abilities:students:read');

    //all students related to the teacher

    Route::get('/teacher/{teacherId}/students', [StudentController::class, 'teacherStudents'])
        ->middleware('abilities:students:read');

    Route::post('/students', [StudentController::class, 'store'])
        ->middleware('abilities:students:create');

    Route::put('/students/{student}', [StudentController::class, 'update'])
        ->middleware('abilities:students:update');

    Route::delete('/students/{student}', [StudentController::class, 'destroy'])
        ->middleware('abilities:students:delete');
});


//Teachers routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/teachers', [TeacherController::class, 'index'])
        ->middleware('abilities:teachers:read');

    Route::post('/teachers', [TeacherController::class, 'store'])
        ->middleware('abilities:teachers:create');

    Route::put('/teachers/{teacher}', [TeacherController::class, 'update'])
        ->middleware('abilities:teachers:update');

    Route::delete('/teachers/{teacher}', [TeacherController::class, 'destroy'])
        ->middleware('abilities:teachers:delete');
});


//Classe Type routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/class-types', [ClasseTypeController::class, 'index'])
        ->middleware('abilities:class-type:read');

    Route::post('/class-types', [ClasseTypeController::class, 'store'])
        ->middleware('abilities:class-type:create');

    Route::put('/class-types/{classType}', [ClasseTypeController::class, 'update'])
        ->middleware('abilities:class-type:update');

    Route::delete('/class-types/{classType}', [ClasseTypeController::class, 'destroy'])
        ->middleware('abilities:class-type:delete');
});




//Classe routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/classes', [ClasseController::class, 'index'])
        ->middleware('abilities:classe:read');

    Route::get('/teachers/{teacherId}/classes', [ClasseController::class, 'teacherClasses'])
        ->middleware(['auth:sanctum', 'abilities:classes:read']);

    Route::get('/teachers/{teacherId}/classe/{classeId}/students', [StudentController::class, 'teacherStudentsClasse'])
        ->middleware('abilities:students:read');

    Route::post('/classes', [ClasseController::class, 'store'])
        ->middleware('abilities:classe:create');

    Route::put('/classes/{classe}', [ClasseController::class, 'update'])
        ->middleware('abilities:classe:update');

    Route::delete('/classes/{classe}', [ClasseController::class, 'destroy'])
        ->middleware('abilities:classe:delete');
});



//Courses routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/courses', [CourseController::class, 'index'])
        ->middleware('abilities:course:read');

    Route::get('/teachers/{teacherId}/courses', [CourseController::class, 'teacherCourses'])
        ->middleware('abilities:courses:read');


    Route::get('/teachers/{teacherId}/course/{courseId}/students', [CourseController::class, 'teacherCourseStudents'])
        ->middleware('abilities:students:read');
    Route::get('/teachers/{teacherId}/courses/{courseId}/students', [CourseController::class, 'teacherCourseStudents'])
        ->middleware('abilities:students:read');
    Route::post('/courses', [CourseController::class, 'store'])
        ->middleware('abilities:course:create');

    Route::put('/courses/{course}', [CourseController::class, 'update'])
        ->middleware('abilities:course:update');

    Route::delete('/courses/{course}', [CourseController::class, 'destroy'])
        ->middleware('abilities:course:delete');
});

//Classe Type Course routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/class-type-courses', [ClassTypeCourseController::class, 'index'])
        ->middleware('abilities:class-type-course:read');

    Route::post('/class-type-courses', [ClassTypeCourseController::class, 'store'])
        ->middleware('abilities:class-type-course:create');

    Route::put('/class-type-courses/{classTypeCourse}', [ClassTypeCourseController::class, 'update'])
        ->middleware('abilities:class-type-course:update');

    Route::delete('/class-type-courses/{classTypeCourse}', [ClassTypeCourseController::class, 'destroy'])
        ->middleware('abilities:class-type-course:delete');
});


//Exams routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/exams', [ExamController::class, 'index'])
        ->middleware('abilities:exam:read');
    Route::get('/teachers/{teacherId}/exams', [ExamController::class, 'teacherExams'])
        ->middleware('abilities:exam:read');
    Route::get('/teacher/{teacherId}/exams', [ExamController::class, 'teacherExams'])
        ->middleware('abilities:exam:read');
    Route::get('/exams/{id}/file', [ExamController::class, 'showFile'])
        ->middleware('abilities:exam:read');
    Route::post('/exams', [ExamController::class, 'store'])
        ->middleware('abilities:exam:create');

    Route::put('/exams/{exam}', [ExamController::class, 'update'])
        ->middleware('abilities:exam:update');

    Route::delete('/exams/{exam}', [ExamController::class, 'destroy'])
        ->middleware('abilities:exam:delete');
});


//ExamRecord routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/examRecords', [ExamRecordController::class, 'index'])
        ->middleware('abilities:examRecord:read');

    Route::post('/examRecords', [ExamRecordController::class, 'store'])
        ->middleware('abilities:examRecord:create');

    Route::put('/examRecords/{examRecord}', [ExamRecordController::class, 'update'])
        ->middleware('abilities:examRecord:update');

    Route::delete('/examRecords/{examRecord}', [ExamRecordController::class, 'destroy'])
        ->middleware('abilities:examRecord:delete');
});

//Attendance Session routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/attendanceSessions', [AttendanceSessionController::class, 'index'])
        ->middleware('abilities:attendanceSession:read');

    Route::get('/teacher/{teacherId}/attendanceSessions', [AttendanceSessionController::class, 'teacherSessions'])
        ->middleware('abilities:attendanceSession:read');

    Route::post('/attendanceSessions', [AttendanceSessionController::class, 'store'])
        ->middleware('abilities:attendanceSession:create');

    Route::put('/attendanceSessions/{attendanceSession}', [AttendanceSessionController::class, 'update'])
        ->middleware('abilities:attendanceSession:update');

    Route::delete('/attendanceSessions/{attendanceSession}', [AttendanceSessionController::class, 'destroy'])
        ->middleware('abilities:attendanceSession:delete');
});

//Attendance Record routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/attendanceRecords', [AttendanceRecordController::class, 'index'])
        ->middleware('abilities:attendanceRecord:read');

    Route::post('/attendanceRecords', [AttendanceRecordController::class, 'store'])
        ->middleware('abilities:attendanceRecord:create');

    Route::put('/attendanceRecords/{attendanceRecord}', [AttendanceRecordController::class, 'update'])
        ->middleware('abilities:attendanceRecord:update');

    Route::delete('/attendanceRecords/{attendanceRecord}', [AttendanceRecordController::class, 'destroy'])
        ->middleware('abilities:attendanceRecord:delete');
});
