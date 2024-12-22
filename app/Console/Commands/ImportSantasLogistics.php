<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportSantasLogistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:santas-logistics {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import Santa\'s logistics CSV file into the database';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $filePath = $this->argument('file');

        // Convert Windows backslashes to forward slashes for compatibility
        $filePath = str_replace('\\', '/', $filePath);

        if (!file_exists($filePath)) {
            $this->error("File not found: $filePath");
            return 1;
        }

        $header = [];
        $data = [];
        $rowCount = 0;

        if (($handle = fopen($filePath, 'r')) !== false) {
            $header = fgetcsv($handle); // Extract header row

            while (($row = fgetcsv($handle)) !== false) {
                $data[] = array_combine($header, $row); // Map header to row data
                $rowCount++;
            }
            fclose($handle);
        }

        foreach ($data as $entry) {
            DB::table('santa_logistics')->insert([
                'Child_ID' => $entry['Child_ID'],
                'Name' => $entry['Name'],
                'Age' => $entry['Age'],
                'Location' => $entry['Location'],
                'Latitude' => $entry['Latitude'],
                'Longitude' => $entry['Longitude'],
                'Country' => $entry['Country'],
                'Gift_Preference' => $entry['Gift_Preference'],
                'Listened_To_Parents' => $entry['Listened_To_Parents'] ?: null,
                'School_Grades' => $entry['School_Grades'] ?: null,
                'Good_Deed' => $entry['Good_Deed'] ?: null,
                'Bad_Deed' => $entry['Bad_Deed'] ?: null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->info("Successfully imported $rowCount rows into the database.");
        return 0;
    }

}
