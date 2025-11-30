<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Materi;

class CheckMateriData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'materi:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check materi data in database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking materi data...');
        
        $totalMateri = Materi::count();
        $this->info("Total materi: {$totalMateri}");
        
        $moduls = Materi::select('modul')->distinct()->get();
        $this->info("\nModul yang ada di database:");
        
        foreach ($moduls as $modul) {
            $count = Materi::where('modul', $modul->modul)->count();
            $this->line("- {$modul->modul}: {$count} pertemuan");
        }
        
        $this->info("\nDetail per modul:");
        foreach ($moduls as $modul) {
            $this->line("\n=== {$modul->modul} ===");
            $materi = Materi::where('modul', $modul->modul)->orderBy('pertemuan')->get();
            foreach ($materi as $item) {
                $this->line("Pertemuan {$item->pertemuan}: {$item->topik}");
            }
        }
        
        return Command::SUCCESS;
    }
}