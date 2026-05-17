<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->nullOnDelete();
            $table->string('title');                    // "Senior Laravel Developer"
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->default('TR');
            // full-time, part-time, freelance, internship
            $table->enum('work_type', ['full-time', 'part-time', 'freelance', 'internship'])->default('full-time');
            // remote, hybrid, onsite
            $table->enum('location_type', ['remote', 'hybrid', 'onsite'])->default('onsite');
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->string('salary_currency')->default('TRY');
            $table->boolean('salary_visible')->default(true);
            // draft, published, closed
            $table->enum('status', ['draft', 'published', 'closed'])->default('draft');
            $table->boolean('is_featured')->default(false);  // öne çıkan ilan
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_listings');
    }
};