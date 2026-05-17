<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
public function redirect(Request $request)
{
    $role = $request->get('role', 'jobseeker');
    
    // role'ü session yerine state parametresine göm
    return Socialite::driver('google')
        ->stateless()
        ->redirectUrl(config('services.google.redirect'))
        ->scopes(['openid', 'profile', 'email'])
        ->with(['state' => base64_encode(json_encode(['role' => $role]))])
        ->redirect();
}

public function callback(Request $request)
{
    try {
        // state'den role'ü çek
        $state = $request->get('state');
        $role = 'jobseeker'; // default
        if ($state) {
            $decoded = json_decode(base64_decode($state), true);
            $role = in_array($decoded['role'] ?? '', ['jobseeker', 'employer']) 
                ? $decoded['role'] 
                : 'jobseeker';
        }

        $googleUser = Socialite::driver('google')
            ->stateless()
            ->redirectUrl(config('services.google.redirect'))
            ->user();

        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            if (empty($user->google_id)) {
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => $user->email_verified_at ?? now(),
                ]);
            }
        } else {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => Hash::make(Str::random(32)),
                'role' => $role, // ← artık doğru rol atanıyor
                'email_verified_at' => now(),
            ]);
        }

        $token = $user->createToken('google-auth')->plainTextToken;
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        return redirect("{$frontendUrl}/callback?token={$token}&user=" . urlencode(json_encode([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'avatar' => $user->avatar,
        ])));

    } catch (\Exception $e) {
        \Log::error('Google OAuth error: ' . $e->getMessage());
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        return redirect("{$frontendUrl}/login?error=google_auth_failed");
    }
}
}