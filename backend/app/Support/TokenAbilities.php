<?php

namespace App\Support;

class TokenAbilities
{
    public static function forRole(string $role): array
    {
        return match ($role) {

            'admin' => [
                '*',
            ],

            'teacher' => [
                'dashboard:view',

                'students:read',
                'students:update',

                'classe:read',
                'classes:read',
                'course:read',
                'courses:read',
                'class-type:read',
                'class-type-course:read',

                'exam:read',
                'exam:create',
                'exam:update',

                'examRecord:read',
                'examRecord:create',
                'examRecord:update',

                'attendanceSession:read',
                'attendanceSession:create',
                'attendanceSession:update',

                'attendanceRecord:read',
                'attendanceRecord:create',
                'attendanceRecord:update',

                'profile:read',
                'profile:update',
            ],

            'student' => [
                'dashboard:view',

                'profile:read',
                'profile:update',

                'classe:read',
                'classes:read',
                'course:read',
                'courses:read',

                'exam:read',
                'examRecord:read',

                'attendanceSession:read',
                'attendanceRecord:read',
            ],

            'parent' => [
                'dashboard:view',

                'profile:read',
                'profile:update',

                'students:read',

                'classe:read',
                'classes:read',
                'course:read',
                'courses:read',

                'exam:read',
                'examRecord:read',

                'attendanceSession:read',
                'attendanceRecord:read',
            ],

            default => [],
        };
    }
}
