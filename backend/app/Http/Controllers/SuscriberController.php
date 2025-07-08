<?php

namespace App\Http\Controllers;

use App\Models\Suscriber;
use Illuminate\Http\Request;

class SuscriberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Suscriber::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:suscribers,email',
        ]);
        $suscriber = Suscriber::create($request->all());
        return response()->json($suscriber, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Suscriber $suscriber)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Suscriber $suscriber)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Suscriber $suscriber)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Suscriber $suscriber)
    {
        //
    }
}
