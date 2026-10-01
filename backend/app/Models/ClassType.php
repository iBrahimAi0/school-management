<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class ClassType extends User
{
     use HasFactory, softDeletes;
     protected $fillable = [
          'name',
          'code'
     ];
     protected $table = 'class_types';
}
