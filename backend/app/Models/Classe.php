<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Classe extends Model
{
    use HasFactory, softDeletes;
    protected $fillable = ['name', 'code', 'class_type_id', 'teacher_id'];

    public function classType()
    {
        return $this->belongsTo(ClassType::class, 'class_type_id');
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}
