<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends User
{
     use HasFactory, softDeletes;
     protected $fillable = ['name', 'description'];
}
