<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SantasLogistic extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'santa_logistics';
    // Define the fillable fields for mass assignment
    protected $fillable = [
        'Child_ID',
        'Name',
        'Age',
        'Location',
        'Latitude',
        'Longitude',
        'Country',
        'Gift_Preference',
        'Listened_To_Parents',
        'School_Grades',
        'Good_Deed',
        'Bad_Deed',
        'Status',
    ];

    // Disable auto-increment for the Child_ID
    protected $primaryKey = 'Child_ID';
    public $incrementing = false;
    protected $keyType = 'int';
}
