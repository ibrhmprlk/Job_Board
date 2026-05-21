<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Profil bulunamadı'], 404);
        }

        $data = $profile->toArray();

        if ($profile->cv_path) {
            $data['cv_url'] = $this->generateCvUrl($profile->cv_path);
            $data['cv_name'] = basename($profile->cv_path);
        } else {
            $data['cv_url'] = null;
            $data['cv_name'] = null;
        }

        return response()->json($data);
    }

    public function destroyEmail(Request $request)
    {
        $user = $request->user();
        $user->email = 'deleted_' . $user->id . '@deleted.com';
        $user->save();

        return response()->json(['message' => 'Mail adresi silindi']);
    }

    public function upsert(Request $request)
    {
        $data = $request->validate([
            'title'            => 'nullable|string|max:255',
            'bio'              => 'nullable|string',
            'phone'            => 'nullable|string|max:20',
            'city'             => 'nullable|string|max:100',
            'country'          => 'nullable|string|max:100',
            'linkedin_url'     => 'nullable|url',
            'github_url'       => 'nullable|url',
            'portfolio_url'    => 'nullable|url',
            'experience_years' => 'nullable|integer|min:0',
            'expected_salary'  => 'nullable|integer',
            'salary_currency'  => 'nullable|string|max:3',
            'is_open_to_work'  => 'nullable|boolean',
            'avatar'           => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar_path'] = $request->file('avatar')->store('avatars/' . $request->user()->id, 's3');
        }
        unset($data['avatar']);

        $profile = Profile::updateOrCreate(
            ['user_id' => $request->user()->id],
            $data
        );

        return response()->json($profile);
    }

    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:5120',
        ]);

        $cvPath = $request->file('cv')->store('cvs/profiles/' . $request->user()->id, 's3');

        $profile = Profile::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['cv_path' => $cvPath]
        );

        $cvUrl = $this->generateCvUrl($cvPath);

        return response()->json([
            'message' => 'CV başarıyla yüklendi',
            'cv_url'  => $cvUrl,
            'cv_name' => basename($cvPath),
        ]);
    }

    public function deleteCv(Request $request)
    {
        $profile = $request->user()->profile;

        if (!$profile || !$profile->cv_path) {
            return response()->json(['message' => 'Silinecek CV bulunamadı'], 404);
        }

        if (Storage::disk('s3')->exists($profile->cv_path)) {
            Storage::disk('s3')->delete($profile->cv_path);
        }

        $profile->cv_path = null;
        $profile->save();

        return response()->json(['message' => 'CV silindi']);
    }

    public function getCvUrl(Request $request, string $path)
    {
        $path = ltrim($path, '/');

        if (!Storage::disk('s3')->exists($path)) {
            return response()->json(['message' => 'Dosya bulunamadı'], 404);
        }

        $url = $this->generateCvUrl($path);

        return response()->json(['url' => $url]);
    }

    private function generateCvUrl(string $path): string
    {
        return Storage::disk('s3')->temporaryUrl($path, now()->addMinutes(30));
    }
}
