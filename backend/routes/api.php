<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\ApiAuthController;
use App\Http\Controllers\JobListingController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SavedJobController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\GoogleAuthController;


Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback']);



Route::post('/forgot-password', [PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [NewPasswordController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/admin/stats', [AdminController::class, 'stats']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::get('/admin/jobs', [AdminController::class, 'jobs']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    
Route::delete('/admin/jobs/{id}', [AdminController::class, 'deleteJob']);
});
// Herkese açık
Route::get('/categories', [CategoryController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cv/{path}', [ProfileController::class, 'getCvUrl'])
        ->where('path', '.*');
});
// Giriş gerektiren
Route::middleware('auth:sanctum')->group(function () {
    // Profil
   Route::delete('/profile/email', [ProfileController::class, 'destroyEmail']);
    Route::get('/profile',        [ProfileController::class, 'show']);
    Route::post('/profile',       [ProfileController::class, 'upsert']);
    Route::post('/profile/cv',    [ProfileController::class, 'uploadCv']);
Route::delete('/profile/cv', [ProfileController::class, 'deleteCv']);
    // Kategoriler (admin)
    Route::post('/categories',        [CategoryController::class, 'store']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Kaydedilen ilanlar
    Route::get('/saved-jobs',          [SavedJobController::class, 'index']);
    Route::post('/saved-jobs/{jobId}', [SavedJobController::class, 'store']);
    Route::delete('/saved-jobs/{jobId}', [SavedJobController::class, 'destroy']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Başvuru route'ları
    Route::post('/jobs/{jobId}/apply',          [JobApplicationController::class, 'store']);
    Route::get('/my-applications',              [JobApplicationController::class, 'myApplications']);
    Route::get('/jobs/{jobId}/applications',    [JobApplicationController::class, 'listingApplications']);
    Route::put('/applications/{id}/status',     [JobApplicationController::class, 'updateStatus']);
    // Hesap sil
Route::delete('/account', [ApiAuthController::class, 'deleteAccount']);
});

Route::middleware('auth:sanctum')->group(function () {
    // Şirket route'ları
    Route::post('/company',  [CompanyController::class, 'store']);
    Route::put('/company',   [CompanyController::class, 'update']);
    Route::get('/company',   [CompanyController::class, 'show']);
    Route::delete('/company/email', [CompanyController::class, 'destroyEmail']);
});

// Herkese açık
Route::get('/jobs',      [JobListingController::class, 'index']);
Route::get('/jobs/{slug}', [JobListingController::class, 'show']);

// Giriş gerektiren
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/jobs',           [JobListingController::class, 'store']);
    Route::put('/jobs/{id}',       [JobListingController::class, 'update']);
    Route::delete('/jobs/{id}',    [JobListingController::class, 'destroy']);
    Route::get('/my-listings',     [JobListingController::class, 'myListings']);
});

// Public route'lar
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login',    [ApiAuthController::class, 'login']);

// Giriş gerektiren route'lar
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    Route::get('/me',      [ApiAuthController::class, 'me']);
});
