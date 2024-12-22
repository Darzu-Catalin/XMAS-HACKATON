<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SantasLogisticsController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\VisionController;
use App\Http\Controllers\GeocodingController;
use App\Http\Controllers\FactoryController;
use App\Http\Controllers\InputDataController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/input-data', [InputDataController::class, 'fetch']);
Route::post('/process-letter', [OpenAIController::class, 'processLetter']);
Route::post('/recognize-text', [VisionController::class, 'recognizeText']);
Route::post('/geocode', [GeocodingController::class, 'geocode']);
Route::get('/factory', [FactoryController::class, 'getFactoryData']);

Route::get('/santas-statistics', [SantasLogisticsController::class, 'index']);
Route::get('/getAllData', [SantasLogisticsController::class, 'getAllData']);
Route::get('/getPath', [SantasLogisticsController::class, 'getPath']);
Route::post('/markAsDelivered', [SantasLogisticsController::class, 'markAsDelivered']);
