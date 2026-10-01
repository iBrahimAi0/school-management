<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamRecord extends Model
{
   use HasFactory, softDeletes;
   protected $fillable = ['exam_id', 'user_id', 'note', 'comment',];

   public function exam()
   {
      return $this->belongsTo(Exam::class, 'exam_id');
   }

   public function student()
   {
      return $this->belongsTo(User::class, 'user_id');
   }
}
