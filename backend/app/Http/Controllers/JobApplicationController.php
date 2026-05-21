<?php
namespace App\Http\Controllers;
use App\Models\JobApplication;
use App\Models\JobListing;
use Illuminate\Http\Request;
use App\Notifications\ApplicationSubmitted;
use App\Notifications\ApplicationStatusChanged;
use App\Notifications\ApplicationReceived;

class JobApplicationController extends Controller
{
    // İş arayan: ilana başvur
    public function store(Request $request, $jobId)
    {
        if (!$request->user()->isJobseeker()) {
            return response()->json(['message' => 'Yetkisiz işlem'], 403);
        }

        $job = JobListing::where('id', $jobId)
            ->where('status', 'published')
            ->firstOrFail();

        $exists = JobApplication::where('job_listing_id', $jobId)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Bu ilana zaten başvurdunuz'], 422);
        }

        $data = $request->validate([
            'cover_letter' => 'nullable|string',
            'cv'           => 'nullable|file|mimes:pdf|max:5120',
        ]);

       $cvPath = null;
if ($request->hasFile('cv')) {
    try {
        $cvPath = $request->file('cv')->store(
            'cvs/' . $request->user()->id,
            's3'
        );
        \Log::info('CV yüklendi: ' . $cvPath);
    } catch (\Exception $e) {
        \Log::error('CV yükleme hatası: ' . $e->getMessage());
    }
}

        $application = JobApplication::create([
            'job_listing_id' => $jobId,
            'user_id'        => $request->user()->id,
            'cover_letter'   => $data['cover_letter'] ?? null,
            'cv_path'        => $cvPath,
            'status'         => 'pending',
        ]);

        try {
            $job->company->user->notify(new ApplicationSubmitted($application->load('jobListing', 'user')));
        } catch (\Exception $e) {}

        try {
            $request->user()->notify(new ApplicationReceived($application));
        } catch (\Exception $e) {}

        return response()->json($application, 201);
    }

    // İş arayan: kendi başvurularını listele
    public function myApplications(Request $request)
    {
        if (!$request->user()->isJobseeker()) {
            return response()->json(['message' => 'Unauthorized operation.'], 403);
        }

        $applications = JobApplication::with('jobListing.company')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    // İşveren: ilanına gelen başvuruları listele
public function listingApplications(Request $request, $jobId){
    $job = JobListing::findOrFail($jobId);
    if($job->company->user_id !== $request->user()->id){
        return response()->json(['message' => 'Yetkisiz işlem'], 403);
    }
    $applications = JobApplication::with('user.profile')
        ->where('job_listing_id', $jobId)
        ->latest()
        ->paginate(10);

    $applications->getCollection()->transform(function ($app) {
        if ($app->cv_path) {
            try {
                $app->cv_url = \Storage::disk('s3')->temporaryUrl(
                    $app->cv_path, 
                    now()->addMinutes(30)
                );
            } catch (\Exception $e) {
                $app->cv_url = null;
            }
        }
        return $app;
    });

    return response()->json($applications);
}

    // İşveren: başvuru durumunu güncelle
    public function updateStatus(Request $request, $applicationId)
    {
        $application = JobApplication::with('jobListing.company')->findOrFail($applicationId);

        if ($application->jobListing->company->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Yetkisiz işlem'], 403);
        }

        $data = $request->validate([
            'status'        => 'required|in:pending,reviewing,shortlisted,rejected,hired',
            'employer_note' => 'nullable|string',
        ]);

        $data['reviewed_at'] = now();
        $application->update($data);

        try {
            $application->user->notify(new ApplicationStatusChanged($application->load('jobListing')));
        } catch (\Exception $e) {}

        return response()->json($application);
    }
}
