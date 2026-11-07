<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Classe;
use App\Models\ClassType;
use App\Models\Course;
use App\Models\StudentParent;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(30)->create();

        StudentParent::factory(30)->create();

        Teacher::factory(30)->create();

        ClassType::factory(30)->create();

        Classe::factory(30)->create();

        Course::factory(30)->create();

        Admin::factory()->create([
            'first_name' => 'Admin',
            'last_name' => 'Admin',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber(), 10),
            'email' => 'admin@example.com',
            "password" => Hash::make('admin123456')
        ]);
        StudentParent::factory()->create([
            'first_name' => 'Parent',
            'last_name' => 'Parent',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber(), 10),
            'blood_type' => 'B-',
            'email' => 'parent@example.com',
            "password" => Hash::make('parent123456')
        ]);
        User::factory()->create([
            'first_name' => 'Student',
            'last_name' => 'Student',
            'date_of_birth' => fake()->date(),
            'student_parent_id' => 1,
            'classe_id' => 1,
            'blood_type' => 'B-',
            'email' => 'student@example.com',
            "password" => Hash::make('student123456')
        ]);
        Teacher::factory()->create([
            'first_name' => 'Teacher',
            'last_name' => 'Teacher',
            'date_of_birth' => fake()->date(),
            'address' => fake()->address(),
            'phone' => substr(fake()->phoneNumber(), 10),
            'email' => 'teacher@example.com',
            "password" => Hash::make('teacher123456')
        ]);
    }
}
