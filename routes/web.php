<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return view('landing');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/dashboard/statistics', function () {
    return Inertia::render('Statistics');
})->middleware(['auth', 'verified'])->name('statistics');
Route::get('/dashboard/children', function () {
    return Inertia::render('Children');
})->middleware(['auth', 'verified'])->name('children');
Route::get('/dashboard/map', function () {
    return Inertia::render('Map');
})->middleware(['auth', 'verified'])->name('map');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
