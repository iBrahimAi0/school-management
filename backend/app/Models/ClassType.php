<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassType extends Model
{
     use HasFactory, softDeletes;
     protected $fillable = [
          'name',
          'code'
     ];
     protected $table = 'class_types';

     public function courses()
     {
          return $this->belongsToMany(Course::class, 'class_type_courses');
     }
}
