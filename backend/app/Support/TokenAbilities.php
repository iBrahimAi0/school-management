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

                'classes:read',
                'subjects:read',

                'grades:read',
                'grades:create',
                'grades:update',

                'attendance:read',
                'attendance:create',
                'attendance:update',

                'profile:read',
                'profile:update',
            ],

            'student' => [
                'dashboard:view',

                'profile:read',
                'profile:update',

                'grades:read',
                'attendance:read',

                'classes:read',
                'subjects:read',
            ],

            'parent' => [
                'dashboard:view',

                'profile:read',
                'profile:update',

                'students:read',

                'grades:read',
                'attendance:read',

                'classes:read',
                'subjects:read',
            ],

            default => [],
        };
    }
}
