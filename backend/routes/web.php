<?php

use Illuminate\Routing\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'School Management API is running!',
    ]);
});
