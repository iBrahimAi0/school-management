<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class StudentParent extends Authenticatable
{
    use HasFactory, softDeletes, HasApiTokens;

    protected $fillable = [
        'first_name',
        'last_name',
        'last_login_date',
        'date_of_birth',
        'gender',
        'blood_type',
        'address',
        'phone',
        'email',
        'password'
    ];
    protected $hidden = [
        'password',
        'remember_token',
        'email_verified_at',
        'last_login_date',
        'deleted_at',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_login_date' => 'datetime',
    ];
}
