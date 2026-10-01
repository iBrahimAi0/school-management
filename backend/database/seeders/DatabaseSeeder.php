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
