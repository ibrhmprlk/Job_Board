<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\JobListing;
use App\Models\JobApplication;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            abort(403, 'Yetkisiz işlem');
        }
    }
    
public function deleteJob(Request $request, $id)
{
    $this->checkAdmin($request);

    $job = JobListing::findOrFail($id);
    $job->delete();

    return response()->json(['message' => 'İlan silindi']);
}
    public function stats(Request $request)
    {
        $this->checkAdmin($request);

        return response()->json([
            'users'        => User::count(),
            'employers'    => User::where('role', 'employer')->count(),
            'jobseekers'   => User::where('role', 'jobseeker')->count(),
            'jobs'         => JobListing::count(),
            'applications' => JobApplication::count(),
            'companies'    => Company::count(),
        ]);
    }

    public function users(Request $request)
    {
        $this->checkAdmin($request);

        $users = User::orderBy('created_at', 'desc')->get();
        return response()->json($users);
    }

    public function jobs(Request $request)
    {
        $this->checkAdmin($request);

        $jobs = JobListing::with('company')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($jobs);
    }

    public function deleteUser(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Admin silinemez'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Kullanıcı silindi']);
    }
}