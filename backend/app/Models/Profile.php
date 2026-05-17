<?php
 namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Profile extends Model{
protected $fillable=[

    'user_id',
        'title',
        'bio',
        'phone',
        'city',
        'country',
        'cv_path',
        'avatar_path',
        'linkedin_url',
        'github_url',
        'portfolio_url',
        'experience_years',
        'expected_salary',
        'salary_currency',
        'is_open_to_work',
];

protected $casts =[
'is_open_to_work'=>'boolean',
];
public function user(){
    return $this->belongsTo(User::class);
}


}





?>