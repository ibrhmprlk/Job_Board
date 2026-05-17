<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SavedJob;
use App\Models\JobListing;

class SavedJobController extends Controller
{
    // Kaydedilen ilanları listele
    public function index(Request $request)
    {
        $savedJobs = SavedJob::with('jobListing.company')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($savedJobs);
    }

    // İlanı kaydet
    public function store(Request $request, $jobId)
    {
        // İlanın var olduğundan emin ol
        JobListing::findOrFail($jobId);

        // Zaten kaydedilmiş mi kontrol et
        $exists = SavedJob::where('user_id', $request->user()->id)
            ->where('job_listing_id', $jobId)
            ->exists();

        if ($exists) {  // ✅ TERS DEĞİL! VARSA hata dön
            return response()->json(['message' => '
İş zaten kaydedildi
'], 422);
        }

        $saved = SavedJob::create([
            'user_id' => $request->user()->id,
            'job_listing_id' => $jobId,
        ]);

        return response()->json($saved, 201);
    }

    // İlanı kayıtlardan kaldır
    public function destroy(Request $request, $jobId)
    {
        $saved = SavedJob::where('user_id', $request->user()->id)
            ->where('job_listing_id', $jobId)
            ->firstOrFail();

        $saved->delete();

        return response()->json(['message' => 'İş kayıtlardan kaldırıldı']);
    }
}