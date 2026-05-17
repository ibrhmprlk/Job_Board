<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class JobListing extends Model
{
protected $fillable=[
    'company_id',
    'category_id',
    'title',
    'description',
    'requirements',
    'city',
    'country',
    'work_type',
    'location_type',
    'salary_min',
    'salary_max',
    'salary_currency',
    'salary_visible',
    'status',
    'is_featured',
    'published_at',
    'expires_at',    
];
protected $casts=[
    'salary_visible'=>'boolean',
    'is_featured'=>'boolean',
    'published_at'=>'datetime',
    'expires_at'=>'datetime',
];
protected static function boot(){ // boot Nedir? : Model olaylarını yakalar. creating -> kayıt oluşturulmadan önce çalışır. Biz burada otomatik slug üretiyoruz.
    parent::boot();
    static::creating(function($job){
$job->slug =Str::slug($job->title) . '_' . Str::random(6);
    });
}

//İlişkiler
public function company(){
    return $this->belongsTo(Company::class);
}
public function category(){
    return $this->belongsTo(Category::class);
}
public function applications(){
    return $this->hasMany(Application::class);

}
}