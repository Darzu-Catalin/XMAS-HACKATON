<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Controllers\VisionController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\GeocodingController;
use App\Models\SantasLogistic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InputDataController extends Controller
{
    /**
     * This method demonstrates how to:
     * 1. Call VisionController to recognize text from an uploaded image.
     * 2. Extract recognized text.
     * 3. Pass that recognized text to OpenAIController to parse it.
     * 4. Use GeocodingController to fetch latitude/longitude from the parsed address.
     * 5. Fill in any missing data with random defaults.
     * 6. Store the data into 'santa_logistics' table via SantasLogistic model.
     */
    public function fetch(Request $request)
    {
        // --------------------------------------
        // 1. Extract text from the uploaded image
        // --------------------------------------
        try {
            // Instantiate the VisionController to reuse its logic
            $visionController = new VisionController();

            // The VisionController expects 'image' in the request
            $visionResponse = $visionController->recognizeText($request);
            $visionData = $visionResponse->getData(true);

            // Check if the VisionController returned an error
            if (isset($visionData['success']) && $visionData['success'] === false) {
                return response()->json([
                    'error'   => 'Vision API text recognition failed.',
                    'details' => $visionData['error'] ?? 'Unknown error',
                ], 422);
            }

            // Here we assume the recognized text is in:
            // $visionData['responses'][0]['fullTextAnnotation']['text']
            // or $visionData['responses'][0]['textAnnotations'][0]['description']
            if (!empty($visionData['responses'][0]['fullTextAnnotation']['text'])) {
                $recognizedText = $visionData['responses'][0]['fullTextAnnotation']['text'];
            } elseif (!empty($visionData['responses'][0]['textAnnotations'][0]['description'])) {
                $recognizedText = $visionData['responses'][0]['textAnnotations'][0]['description'];
            } else {
                return response()->json([
                    'error' => 'No text found in the image.',
                ], 422);
            }

        } catch (\Exception $e) {
            Log::error('Error calling VisionController: '.$e->getMessage());
            return response()->json([
                'error'   => 'Failed to process image with Vision API',
                'message' => $e->getMessage(),
            ], 500);
        }

        // --------------------------------------
        // 2. Parse text using OpenAI
        // --------------------------------------
        try {
            // Instantiate OpenAIController
            $openAIController = new OpenAIController();

            // Create a new Request with 'text' => $recognizedText
            $openAIRequest = new Request();
            $openAIRequest->merge(['text' => $recognizedText]);

            // Call processLetter in OpenAIController
            $openAIResponse = $openAIController->processLetter($openAIRequest);
            $openAIData = $openAIResponse->getData(true);

            // Check for errors
            if (isset($openAIData['error'])) {
                return response()->json([
                    'error'   => 'Failed to parse recognized text with OpenAI.',
                    'details' => $openAIData['error'],
                ], 422);
            }

        } catch (\Exception $e) {
            Log::error('Error calling OpenAIController: '.$e->getMessage());
            return response()->json([
                'error'   => 'Failed to communicate with OpenAI',
                'message' => $e->getMessage(),
            ], 500);
        }

        // --------------------------------------
        // 3. Geocode the parsed address
        //    (if no address found, use random coords)
        // --------------------------------------
        // Let's assume that OpenAI gave us an "address" field in $openAIData
        $parsedAddress = $openAIData['address'] ?? null;

        $latitude  = null;
        $longitude = null;
        $country   = null;

        if ($parsedAddress) {
            // Instantiate the GeocodingController
            $geocodingController = new GeocodingController();

            // Make a new request with the 'address' field
            $geocodeRequest = new Request();
            $geocodeRequest->merge(['address' => $parsedAddress]);

            $geocodeResponse = $geocodingController->geocode($geocodeRequest);
            $geocodeData     = $geocodeResponse->getData(true);

            // If geocoding is successful
            if (isset($geocodeData['success']) && $geocodeData['success'] === true) {
                $latitude  = $geocodeData['latitude']  ?? null;
                $longitude = $geocodeData['longitude'] ?? null;
                // Some geocoding results also have "formatted_address". You could parse the country from there.
                // For simplicity, let's just store a placeholder country if we can't parse it.
                $country   = $this->extractCountryFromGeocodeResult($geocodeData) ?? 'Unknown Country';
            }
        }

        // If we still have no lat/long, set random ones (e.g., random global coords)
        if (is_null($latitude) || is_null($longitude)) {
            $latitude  = rand(-90, 90) + (rand(0, 999999) / 1000000);   // random-ish
            $longitude = rand(-180, 180) + (rand(0, 999999) / 1000000); // random-ish
        }

        if (!$country) {
            // If we can’t find a country, use a random fallback
            $country = 'Narnia'; // or any placeholder you like
        }

        // --------------------------------------
        // 4. Prepare data for SantasLogistic
        // --------------------------------------
        try {
            // We'll fill SantasLogistic with what we have, using random defaults if not present
            // The user wants random if there's no data

            // Child_ID is primary key, no auto-increment, so we create a random integer
            // (Ensure you handle collisions if real scenario)
            $childId = rand(10000, 99999);

            // Some random age between 5-15 if none
            $age = $openAIData['age'] ?? rand(5, 15);

            // Some random gift preference from the parsed 'presents_wanted' or fallback
            // If openAIData has "presents_wanted": []
            $presentsWanted = $openAIData['presents_wanted'] ?? [];
            $giftPreference = count($presentsWanted) 
                ? implode(', ', $presentsWanted)
                : 'Chocolate Cake'; // random fallback

            // Some random booleans or yes/no for these fields
            $listenedToParents = rand(0,1) === 1 ? 'Yes' : 'No';
            // Some random grade or letter for School_Grades
            $schoolGrades = ['A', 'B', 'C', 'D', 'E', 'F'];
            $randomGrade  = $schoolGrades[array_rand($schoolGrades)];

            // Some random Good/Bad deeds counts
            $goodDeedCount = rand(0, 10);
            $badDeedCount  = rand(0, 5);

            // Some random status
            $statusArray = ['Pending', 'Approved', 'Denied'];
            $status      = $statusArray[array_rand($statusArray)];

            // Create the SantasLogistic object
            $logistic = new SantasLogistic();
            $logistic->Child_ID           = $childId;
            $logistic->Name               = $openAIData['name'] ?? 'Unknown Child';
            $logistic->Age                = $age;
            $logistic->Location           = $parsedAddress ?? 'Unknown Location';
            $logistic->Latitude           = $latitude;
            $logistic->Longitude          = $longitude;
            $logistic->Country            = $country;
            $logistic->Gift_Preference    = $giftPreference;
            $logistic->Listened_To_Parents = strtolower($listenedToParents) === 'yes' ? 1.0 : 0.0;
            $logistic->School_Grades      = rand(5, 10);
            $logistic->Good_Deed          = $goodDeedCount;
            $logistic->Bad_Deed           = $badDeedCount;
            $logistic->Status             = 'Waiting';
            
            $logistic->save();

            // Return success response
            return response()->json([
                'success'  => true,
                'child_id' => $childId,
                'data'     => $logistic,
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error saving SantasLogistic data: '.$e->getMessage());
            return response()->json([
                'error'   => 'Failed to save the extracted data.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Attempt to extract a country string from the geocode result.
     * This is just an example. Adjust for your own geocoding response structure.
     */
    private function extractCountryFromGeocodeResult(array $geocodeData)
    {
        // If the geocoding response includes "address_components", we can loop through them.
        // This is purely illustrative. You might need to check your actual geocoding data.
        if (isset($geocodeData['details']['results'][0]['address_components'])) {
            foreach ($geocodeData['details']['results'][0]['address_components'] as $component) {
                if (in_array('country', $component['types'])) {
                    return $component['long_name'] ?? null;
                }
            }
        }
        return null;
    }
}
