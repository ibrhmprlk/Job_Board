<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Google hesabı kontrolü
        $user = User::where('email', $request->email)->first();
        if ($user && $user->google_id) {
            return response()->json([
                'message' => 'Bu hesap Google ile oluşturulmuştur. Lütfen Google ile giriş yapın.'
            ], 422);
        }

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status != Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => ['Bu e-posta adresine kayıtlı kullanıcı bulunamadı.'],
            ]);
        }

        return response()->json(['status' => __($status)]);
    }
}