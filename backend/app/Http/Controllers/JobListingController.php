<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JobListing;
class JobListingController extends Controller
{
    // Herkese açık: tüm yayınlanmış ilanları listele
    public function index(Request $request){
        $jobs = JobListing::with('company','category')->where('status', 'published')
        ->latest('published_at')
        ->paginate(10);
        return response()->json($jobs);
    }
    
    // Herkese açık: tek ilan görüntüle
    public function show($slug){
        $job = JobListing::with('company','category')
        ->where('slug',$slug)
        ->where('status','published')
        ->firstOrFail();
        return response()->json($job);
    }
    
    // Sadece employer: ilan oluştur
    public function store(Request $request){
        if(! $request->user()->isEmployer())
        {
            return response()->json(['message'=>'Yetkisiz işlem'],403);
        }
        $data = $request->validate([
            'title'=>'required|string|max:255',
            'description'=>'required|string',
            'requirements'=>'nullable|string',
            'city'=>'nullable|string',
            'work_type'=> 'required|in:full-time,part-time,freelance,internship',
            'location_type'   => 'required|in:remote,hybrid,onsite',
            'salary_min'=>'nullable|integer',
            'salary_max'=>'nullable|integer|',
            'salary_currency'=>'nullable|string|max:3',
            'category_id'     => 'nullable|exists:categories,id',
            'status'          => 'sometimes|in:draft,published',
        ]);
        // İşverenin şirketini bul
        $company= $request->user()->company;
        if (! $company) {
            return response()->json(['message' => 'Öncelikle bir şirket profili oluşturmanız gerekiyor'], 422);
        }
        $data['company_id']=$company->id;
        if(isset($data['status'])&&$data['status']==='published')
        {
            $data['published_at']=now();
        }
        $job=JobListing::create($data);
        return response()->json($job,201);
    }

    // Sedece employer: kendi ilanını güncelle
    public function update(Request $request,$id){
        $job=JobListing::findOrFail($id);
        if($job->company->user_id !==$request->user()->id)
        {
           return response()->json(['message'=>'Yetkisiz işlem.'],403);
        }
    $data = $request->validate([
        'title'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|string',
            'requirements'    => 'nullable|string',
            'city'            => 'nullable|string',
            'work_type'       => 'sometimes|in:full-time,part-time,freelance,internship',
            'location_type'   => 'sometimes|in:remote,hybrid,onsite',
            'salary_min'      => 'nullable|integer',
            'salary_max'      => 'nullable|integer',
            'salary_visible'  => 'sometimes|boolean',
            'status'          => 'sometimes|in:draft,published,closed',
    ]);
    if(isset($data['status'])&&$data['status']==='published'&& ! $job->published_at)
    {
        $data['published_at']=now();
    }
    $job->update($data);
    return response()->json($job);
    }

    // Sadece employer: kendi ilanını sil
    public function destroy(Request $request,$id)
    {
      $job=JobListing::findOrFail($id);
      if($job->company->user_id!==$request->user()->id){
        return response()->json(['message'=>'Yetkisiz işlem'],403);
      }
      $job->delete();
      return response()->json(['message'=>'İlan başarıyla silindi']);
    }

    // Employer: kendi ilanlarını listele

  public function myListings(Request $request)
{
    if (! $request->user()->isEmployer()) {
        return response()->json(['message' => 'Yetkisiz işlem'], 403);
    }

    $company = $request->user()->company;

    if (! $company) {
        return response()->json([
            'current_page' => 1,
            'data' => [],
            'total' => 0,
        ]);
    }

    $jobs = JobListing::with('category')
        ->where('company_id', $company->id)
        ->latest()
        ->paginate(10);

    return response()->json($jobs);
}

}
