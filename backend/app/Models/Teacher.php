<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Teacher extends Authenticatable
{
    use HasApiTokens, HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $hidden = [
        'password',
        'email_verified_at',
    ];

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
    protected $casts = [
        'date_of_birth' => 'date',
    ];
}
