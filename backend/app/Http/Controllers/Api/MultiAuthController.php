<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Admin;
use App\Models\StudentParent;
use App\Models\Teacher;
use App\Models\User;
use App\Support\TokenAbilities;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MultiAuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        // Executes validation, rate-limiting, and multi-guard resolution
        $authData = $request->authenticate();

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }
        $user = $authData['user'];

        $abilities = TokenAbilities::forRole($authData['role']);

        $token = $user->createToken(
            'web-login',
            $abilities
        );

        return response()->json([
            'message' => 'Authenticated successfully',
            'role' => $authData['role'],
            'user' => $user,
            'token' => $token->plainTextToken,
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        $role = match (get_class($user)) {
            Admin::class => 'admin',
            Teacher::class => 'teacher',
            StudentParent::class => 'parent',
            User::class => 'student',
            default => null,
        };

        return response()->json([
            'role' => $role,
            'user' => $user,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
