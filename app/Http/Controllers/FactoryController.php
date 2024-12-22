<?php

namespace App\Http\Controllers;

use App\Models\SantasLogistic;
use Illuminate\Http\Request;

class FactoryController extends Controller
{
    public function getFactoryData()
    {
        // Current "Producing" child
        $producing = SantasLogistic::where('Status', 'Producing')->first();

        // Next child in line for production
        $nextProd = SantasLogistic::where('Status', 'Waiting')
            ->orderByDesc('Listened_To_Parents')
            ->orderByDesc('School_Grades')
            ->first();

        // Additional stats
        $readyCount = SantasLogistic::where('Status', 'Ready')->count();
        $deliveredCount = SantasLogistic::where('Status', 'Delivered')->count();
        $waitingCount = SantasLogistic::where('Status', 'Waiting')->count();
        
        return response()->json([
            'producing' => $producing,
            'next'      => $nextProd,
            'counts'    => [
                'ready'     => $readyCount,
                'delivered' => $deliveredCount,
                'waiting'   => $waitingCount,
            ]
        ], 200);
    }
}
