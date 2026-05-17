<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Company extends Model
{
    protected $fillable=[
        'user_id',
        'name',
        'slug',
        'logo_path',
        'description',
        'website',
        'industry',
        'city',
        'country',
        'employee_count',
        'founded_year',
        'is_verified',
    ];
    protected $casts =['is_verified'=>'boolean'];
    protected static function boot(){
        parent::boot();
        static::creating(function($company){
            $company->slug=Str::slug($company->name) . '_' . Str::random(6);
        });
    }
     public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobListings()
    {
        return $this->hasMany(JobListing::class);
    }
}
