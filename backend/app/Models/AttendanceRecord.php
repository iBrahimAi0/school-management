<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AttendanceRecord extends Model
{
    use SoftDeletes;
    protected $fillable = ['attendance_session_id', 'user_id', 'status'];
    public function attendanceSession()
    {
        return $this->belongsTo(AttendanceSession::class, 'attendance_session_id');
    }
    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
