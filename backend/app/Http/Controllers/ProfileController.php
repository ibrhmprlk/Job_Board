<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Aws\S3\S3Client;

class ProfileController extends Controller
{
    // Profili göster
    public function show(Request $request)
    {
        $profile = $request->user()->profile;
        if (!$profile) {
            return response()->json(['message' => 'Profil bulunamadı'], 404);
        }

        $data = $profile->toArray();

        // Add presigned URL for CV if exists
        if ($profile->cv_path) {
            $data['cv_url'] = $this->generateCvUrl($profile->cv_path);
            $data['cv_name'] = basename($profile->cv_path);
        } else {
            $data['cv_url'] = null;
            $data['cv_name'] = null;
        }

        return response()->json($data);
    }
// ProfileController.php içine ekle
public function destroyEmail(Request $request)
{
    $user = $request->user();
    $user->email = 'deleted_' . $user->id . '@deleted.com';
    $user->save();

    return response()->json(['message' => 'Mail adresi silindi']);
}
    // Profili oluştur veya güncelle
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

        // Avatar yükleme
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

        // Delete from S3
        if (Storage::disk('s3')->exists($profile->cv_path)) {
            Storage::disk('s3')->delete($profile->cv_path);
        }

        // Clear from database
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
        $client = new S3Client([
            'version'                 => 'latest',
            'region'                  => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'endpoint'                => env('AWS_PUBLIC_URL', 'http://localhost:9000'),
            'use_path_style_endpoint' => true,
            'credentials'             => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);

        $cmd = $client->getCommand('GetObject', [
            'Bucket' => env('AWS_BUCKET', 'job-board'),
            'Key'    => $path,
        ]);

        $presignedRequest = $client->createPresignedRequest($cmd, '+30 minutes');
        return (string) $presignedRequest->getUri();
    }
}
  // hasFile =Bu bir kontrol mekanizmasıdır. Kullanıcı formu gönderirken gerçekten bir dosya seçip seçmediğini denetler.
    // Eğer kullanıcı "Profilimi Güncelle" butonuna bastığında bir dosya yüklemediyse, kodun hata vermesini engeller ve o bloğu atlar.

    // store('avatars/' . $id, 's3') ve Neden s3? : store(...): Dosyayı kaydedeceğin klasörü belirler. Burada avatars/ klasörünün içine, karışıklık olmasın diye kullanıcının id'si ile bir alt klasör açıyorsun.
    // 's3': Dosyayı Amazon S3 gibi bir bulut depolama hizmetine kaydetmek istediğini belirtir. Bu, dosyaların sunucunda değil, bulutta saklanmasını sağlar.
    
    // unset($data['avatar']): Bu satır, $data dizisinden avatar anahtarını kaldırır. Çünkü avatar dosyasını ayrı bir şekilde işleyip kaydettiğin için, artık $data dizisinde avatar anahtarına ihtiyacın yoktur. Bu, veritabanına kaydederken gereksiz veya hatalı veri eklenmesini önler.
    // updateOrCreate(...): Bu yöntem, belirtilen koşullara göre bir kayıt günceller veya oluşturur. Eğer user_id'si mevcut olan bir profil varsa, onu günceller; yoksa yeni bir profil oluşturur. Bu, tek bir işlemle hem oluşturma hem de güncelleme yapmanı sağlar.