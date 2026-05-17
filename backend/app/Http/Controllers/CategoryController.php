<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    // Herkese açık: tüm kategoriler
    public function index(){
        $categories=Category::withCount('jobListings')->get();
        return response()->json($categories);
    }

    // Sadece admin: kategori oluştur
    public function store(Request $request){
        if(!$request->user()->isAdmin()){
            return response()->json(['message'=>'Yetkisiz işlem'],403);
        }
        $data=$request->validate([
              'name' => 'required|string|max:255|unique:categories,name',
            'icon' => 'nullable|string',
        ]);
        $data['slug']=Str::slug($data['name']);
        $category=Category::create($data);
        return response()->json($category,201);
    }

    // Sadece admin: kategori sil
    public function destroy(Request $request,$id){
        if(!$request->user()->isAdmin()){
            return response()->json(['message'=>'Yetkisiz işlem'],403);
        }
        $category=Category::findOrFail($id);
        $category->delete();
        return response()->json(['message'=>'
Kategori başarıyla silindi']);
    }
}
