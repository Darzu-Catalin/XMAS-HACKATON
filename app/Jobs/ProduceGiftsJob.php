<?php

namespace App\Jobs;

use App\Models\SantasLogistic;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProduceGiftsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        // Constructor logic, if needed
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        // 1) Mark the currently "Producing" gift as "Ready"
        $producingChild = SantasLogistic::where('Status', 'Producing')->first();
    
        if ($producingChild) {
            $producingChild->Status = 'Ready';
            $producingChild->save();
    
            logger()->info("Gift for child {$producingChild->name} has been produced.");
        }
    
        // 2) Fetch the next child in 'Waiting' status
        $nextChild = SantasLogistic::where('Status', 'Waiting')
            ->orderByDesc('Listened_To_Parents')
            ->orderByDesc('School_Grades')
            ->first();
    
        // 3) If no next child is waiting, return
        if (!$nextChild) {
            return;
        }
    
        // 4) Mark the next child's status as "Producing"
        $nextChild->Status = 'Producing';
        $nextChild->save();
        // 5) Log the production start
        logger()->info("Gift production started for child {$nextChild->Status}.");
    }
    
}
