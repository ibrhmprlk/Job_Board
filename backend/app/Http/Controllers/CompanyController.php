<?php

namespace App\Http\Controllers;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    // Şirket profili oluştur
    public function store(Request $request){if(! $request->user()->isEmployer()){
        return response()->json(['message'=>'Yetkisiz işlem'],403);//Yetkisiz işlem.
    }
   if($request->user()->company){
    return response()->json(['message'=>'Şirket profili zaten mevcut'],422);//Zaten şirket profili var.
   }
   $data=$request->validate([
    'name'           => 'required|string|max:255',
            'description'    => 'nullable|string',
            'website'        => 'nullable|url',
            'industry'       => 'nullable|string',
            'city'           => 'nullable|string',
            'employee_count' => 'nullable|integer',
            'founded_year'   => 'nullable|integer',
   ]);
   $data['user_id']=$request->user()->id;
    $company=Company::create($data);
    return response()->json($company,201);
}

// Şirket profilini güncelle
public function update(Request $request){
    $company=$request->user()->company;
    if(! $company){
        return response()->json(['message'=>'Şirket profili bulunamadı'],404);//Şirket profili bulunamadı.
    }
    $data = $request->validate([
            'name'           => 'sometimes|string|max:255',
            'description'    => 'nullable|string',
            'website'        => 'nullable|url',
            'industry'       => 'nullable|string',
            'city'           => 'nullable|string',
            'employee_count' => 'nullable|integer',
            'founded_year'   => 'nullable|integer',
        ]);
        $company->update($data);
        return response()->json($company);
}
// Şirket profilini göster
public function show(Request $request){
    $company=$request->user()->company;
    if(! $company){
        return response()->json(['message'=>'Şirket profili bulunamadı'],404);//Şirket profili bulunamadı.
    }
    return response()->json($company);
}
// CompanyController.php içine ekle
public function destroyEmail(Request $request)
{
    $user = $request->user();
    $user->email = 'deleted_' . $user->id . '@deleted.com';
    $user->save();

    return response()->json(['message' => 'Mail adresi silindi']);
}
}
