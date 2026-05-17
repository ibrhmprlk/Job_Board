<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_listing_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('cover_letter')->nullable();    // ön yazı
            $table->string('cv_path')->nullable();       // bu başvuruya özel CV
            // pending, reviewing, shortlisted, rejected, hired
            $table->enum('status', ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'])->default('pending');
            $table->text('employer_note')->nullable();   // işverenin notu (aday görmez)
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            // Aynı kişi aynı ilana iki kez başvuramasın
            $table->unique(['job_listing_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};