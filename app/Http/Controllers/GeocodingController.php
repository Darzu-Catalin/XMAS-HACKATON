<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeocodingController extends Controller
{
    /**
     * Geocode an address using Google Maps Geocoding API.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function geocode(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'address' => 'required|string',
        ]);

        $address = $request->input('address');
        $apiKey = env('GOOGLE_MAPS_API_KEY');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'error' => 'Google Maps API key is not configured.',
            ], 500);
        }

        // Build the Geocoding API URL
        $url = 'https://maps.googleapis.com/maps/api/geocode/json';

        try {
            // Send a GET request to the Geocoding API
            $response = Http::withOptions(['verify' => false])->get($url, [
                'address' => $address,
                'key' => $apiKey,
            ]);


            if (!$response->ok()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to connect to the Geocoding API.',
                    'details' => $response->json(),
                ], $response->status());
            }

            // Parse the API response
            $data = $response->json();
            $results = $data['results'] ?? [];

            if (empty($results)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No results found for the provided address.',
                ], 404);
            }

            // Extract latitude and longitude from the first result
            $geometry = $results[0]['geometry']['location'] ?? null;
            $latitude = $geometry['lat'] ?? null;
            $longitude = $geometry['lng'] ?? null;

            return response()->json([
                'success' => true,
                'address' => $address,
                'latitude' => $latitude,
                'longitude' => $longitude,
            ]);
        } catch (\Exception $e) {
            // Handle any exceptions
            return response()->json([
                'success' => false,
                'error' => 'An error occurred while processing the request.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
