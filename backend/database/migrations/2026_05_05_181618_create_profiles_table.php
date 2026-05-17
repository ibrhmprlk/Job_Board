<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title')->nullable();          // "Senior PHP Developer"
            $table->text('bio')->nullable();              // hakkında
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable()->default('TR');
            $table->string('cv_path')->nullable();        // MinIO'daki CV yolu
            $table->string('avatar_path')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->integer('experience_years')->default(0);
            $table->integer('expected_salary')->nullable();
            $table->string('salary_currency')->default('TRY');
            $table->boolean('is_open_to_work')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};