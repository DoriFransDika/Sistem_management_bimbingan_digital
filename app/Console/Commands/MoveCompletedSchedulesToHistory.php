<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Schedule;
use Carbon\Carbon;

class MoveCompletedSchedulesToHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'schedules:move-to-history';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Move completed schedules to history by updating their status';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        
        // Find schedules that are approved/confirmed and the scheduled time has passed
        $schedulesToMove = Schedule::whereIn('status', ['approved', 'confirmed'])
            ->where(function($query) use ($now) {
                $query->where('proposed_date', '<', $now->toDateString())
                    ->orWhere(function($subQuery) use ($now) {
                        $subQuery->where('proposed_date', '=', $now->toDateString())
                                ->where('proposed_time', '<=', $now->toTimeString());
                    });
            })
            ->get();

        $movedCount = 0;

        foreach ($schedulesToMove as $schedule) {
            // Update status to completed
            $schedule->update(['status' => 'completed']);
            $movedCount++;
            
            $this->info("Moved schedule ID {$schedule->id} to completed status");
        }

        $this->info("Successfully moved {$movedCount} schedules to history");
        
        return Command::SUCCESS;
    }
}