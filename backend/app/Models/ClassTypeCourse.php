<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassTypeCourse extends Model
{
    use HasFactory, softDeletes;
    protected $fillable = ['class_type_id', 'course_id', 'coef'];

    public function class_type()
    {
        return $this->belongsTo(ClassType::class, 'class_type_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}
