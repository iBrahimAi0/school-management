<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Exam extends Model
{
    use HasFactory, softDeletes;
    protected $fillable = [
        'name',
        'type',
        'teacher_id',
        'course_id',
        'classe_id',
        'file_path',
        'original_name',
        'mime_type',
        'size',
    ];
    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function examRecords()
    {
        return $this->hasMany(ExamRecord::class);
    }
}
