<?php

namespace App\Http\Controllers;

use App\Models\SantasLogistic;
use Illuminate\Http\Request;

class SantasLogisticsController extends Controller
{
    /**
     * Show general statistics from the santas_logistics table.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Total number of children
        $totalChildren = SantasLogistic::count();

        

        // Average age of children
        $averageAge = SantasLogistic::avg('Age');

        // Top countries by number of children
        $topCountries = SantasLogistic::select('Country')
            ->selectRaw('COUNT(*) as total')
            ->groupBy('Country')
            ->orderByDesc('total')
            ->take(10)
            ->get();

        // Percentage of children who listened to their parents
        $listenedToParentsPercentage = (SantasLogistic::where('Listened_To_Parents', '>=', 0.5)->count() / $totalChildren) * 100;

        $giftsPrepared = (SantasLogistic::where('Status', 'Ready')->count() / $totalChildren) * 100;;
        // Average school grades
        $averageSchoolGrades = SantasLogistic::avg('School_Grades');

        // Number of good deeds and bad deeds
        $goodDeedsCount = SantasLogistic::whereNotNull('Good_Deed')->count();
        $badDeedsCount = SantasLogistic::whereNotNull('Bad_Deed')->count();

        // Return the statistics as a response
        return response()->json([
            'total_children' => $totalChildren,
            'average_age' => round($averageAge, 2),
            'top_countries' => $topCountries,
            'listened_to_parents_percentage' => round($listenedToParentsPercentage, 2),
            'average_school_grades' => round($averageSchoolGrades, 2),
            'good_deeds_count' => $goodDeedsCount,
            'bad_deeds_count' => $badDeedsCount,
            'gifts_prepared' => $giftsPrepared
        ]);
    }

    public function getAllData()
    {
        // Path to the JSON file containing the list of IDs
        $filePath = storage_path('app/Path/santa_path.json');
    
        // Check if the file exists
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }
    
        // Read and decode the JSON file
        $jsonContent = file_get_contents($filePath);
        $decoded = json_decode($jsonContent, true);
    
        // Validate the JSON structure
        if (!$decoded || !is_array($decoded)) {
            return response()->json(['error' => 'Invalid JSON structure'], 400);
        }
    
        // Extract Child_IDs if JSON contains objects [{ "Child_ID": 1 }, { "Child_ID": 2 }]
        // otherwise assume it's already [1,2,3,...]
        if (isset($decoded[0]) && is_array($decoded[0]) && array_key_exists('Child_ID', $decoded[0])) {
            $ids = array_column($decoded, 'Child_ID');
        } else {
            $ids = $decoded;
        }
    
        // If IDs array is empty, return an empty response
        if (empty($ids)) {
            return response()->json([
                'data'       => [],
                'pagination' => [
                    'current_page' => 0,
                    'per_page'     => 0,
                    'total'        => 0,
                    'last_page'    => 0,
                ],
            ]);
        }
    
        // Get pagination params
        $perPage = (int) request()->get('_limit', 9);
        $page = (int) request()->get('page', 1);
    
        // Get status filter (if any)
        $status = request()->input('status'); // e.g. "Ready"
    
        // Build the base query
        $query = SantasLogistic::whereIn('Child_ID', $ids)
            ->orderByRaw('FIELD(Child_ID, ' . implode(',', $ids) . ')');
    
        // If status was provided, filter by status
        if (!empty($status)) {
            $query->where('Status', $status);
        }
    
        // Manual pagination
        $total = $query->count();
        $data = $query->forPage($page, $perPage)->get();
    
        // Prepare pagination metadata
        $pagination = [
            'current_page' => (int) $page,
            'per_page'     => (int) $perPage,
            'total'        => $total,
            'last_page'    => ceil($total / $perPage),
        ];
    
        // Return response
        return response()->json([
            'data'       => $data,
            'pagination' => $pagination,
        ]);
    }
    



    public function getPath()
{
    // Define the path to the JSON file
    $filePath = storage_path('app/Path/santa_path.json');

    // Check if the file exists
    if (!file_exists($filePath)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    // Read and decode the JSON file
    $jsonContent = file_get_contents($filePath);
    $ids = json_decode($jsonContent, true);

    // Validate the JSON structure
    if (!$ids || !is_array($ids)) {
        return response()->json(['error' => 'Invalid JSON structure'], 400);
    }

    // Fetch data from the database for the provided IDs (in one query)
    // Then key by 'Child_ID' for O(1) lookups
    $data = SantasLogistic::whereIn('Child_ID', $ids)
        ->get()
        ->keyBy('Child_ID');

    // Check if the special ID (696969) exists
    $specialId = 696969;
    $specialIndex = array_search($specialId, $ids);

    // Build the response
    $response = [];
    foreach ($ids as $index => $id) {
        $item = [];

        if (isset($data[$id])) {
            $item = [
                'id'      => $id,
                'details' => $data[$id]->toArray(),
            ];
        } else {
            $item = [
                'id'    => $id,
                'error' => 'Data not found',
            ];
        }

        // Add `is_special` field based on the special ID condition
        if ($specialIndex !== false && $index === $specialIndex - 1) {
            $item['is_special'] = true;
        } else {
            $item['is_special'] = false;
        }

        $response[] = $item;
    }

    // Return the response JSON
    return response()->json($response);
}


    public function markAsDelivered(Request $request)
{
    
    // Retrieve the childId from the request body
    $childId = $request->input('childId'); // Ensure the key matches the React payload
    
    // Validate that the childId is provided
    if (!$childId) {
        return response()->json(['message' => 'Child ID is required'], 400);
    }

    // Find the record by Child_ID
    $child = SantasLogistic::where('Child_ID', $childId)->first();

    if (!$child) {
        return response()->json(['message' => 'Child not found'], 404);
    }

    // Update the Status field
    $child->Status = 'Delivered';
    $child->save();

    return response()->json(['message' => 'Status updated successfully', 'data' => $child]);
}

    



}
