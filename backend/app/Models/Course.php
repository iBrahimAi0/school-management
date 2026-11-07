<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
     use HasFactory, softDeletes;
     protected $fillable = ['name', 'description'];

     public function teachers()
     {
          return $this->belongsToMany(Teacher::class);
     }

     public function classTypes()
     {
          return $this->belongsToMany(ClassType::class, 'class_type_courses');
     }
}
