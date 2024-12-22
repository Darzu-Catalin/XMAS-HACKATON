<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('santa_logistics', function (Blueprint $table) {
            $table->id('Child_ID'); // Primary key for Child_ID
            $table->string('Name'); // Name of the child
            $table->integer('Age'); // Age of the child
            $table->string('Location'); // Location description
            $table->decimal('Latitude', 10, 7); // Latitude with precision
            $table->decimal('Longitude', 10, 7); // Longitude with precision
            $table->string('Country'); // Country name
            $table->string('Gift_Preference'); // Gift preference
            $table->float('Listened_To_Parents', 5, 4)->nullable(); // Likelihood of listening to parents
            $table->float('School_Grades', 5, 2)->nullable(); // School grades, allow decimals
            $table->string('Good_Deed')->nullable(); // Description of good deeds
            $table->string('Bad_Deed')->nullable(); // Description of bad deeds
            $table->string('Status')->nullable()->default('Waiting');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('santa_logistics');
    }
};
