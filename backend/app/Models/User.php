<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'last_login_date',
        'date_of_birth',
        'gender',
        'blood_type',
        'email',
        'password',
        'student_parent_id',
        'classe_id',
    ];
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'last_login_date'
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_login_date' => 'datetime',
    ];

    public function studentParent()
    {
        return $this->belongsTo(StudentParent::class, 'student_parent_id');
    }
    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }
}
