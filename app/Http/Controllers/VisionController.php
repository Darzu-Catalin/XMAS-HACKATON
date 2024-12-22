<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VisionController extends Controller
{
    private function getAccessToken()
    {
        $clientId = env('GOOGLE_CLIENT_ID');
        $clientSecret = env('GOOGLE_CLIENT_SECRET_ACCESS_KEY');
        $refreshToken = env('GOOGLE_REFRESH_TOKEN');

        $url = 'https://oauth2.googleapis.com/token';

        $response = Http::asForm()->withOptions(["verify" => false])
            ->post($url, [
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'refresh_token' => $refreshToken,
                'grant_type' => 'refresh_token',
            ]);

        if ($response->ok()) {
            $data = $response->json();
            return $data['access_token'] ?? null;
        }

        throw new \Exception('Failed to obtain access token: ' . $response->body());
    }

    public function recognizeText(Request $request)
    {
        // Validate the uploaded image
        $request->validate([
            'image' => 'required|image|max:5120',
        ]);

        // Get the uploaded image content as base64
        $imageContent = base64_encode(file_get_contents($request->file('image')->path()));

        // Get a new access token
        try {
            $accessToken = $this->getAccessToken();
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }

        // Vision API URL
        $url = 'https://vision.googleapis.com/v1/images:annotate';

        // Build the request payload
        $payload = [
            'requests' => [
                [
                    'image' => [
                        'content' => $imageContent,
                    ],
                    'features' => [
                        [
                            'type' => 'TEXT_DETECTION',
                        ],
                    ],
                ],
            ],
        ];

        // Make the Vision API request
        $response = Http::withToken($accessToken)->withOptions(["verify" => false])
            ->post($url, $payload);

        // Handle the response
        if ($response->ok()) {
            return response()->json($response->json());
        }

        return response()->json([
            'success' => false,
            'error' => $response->json(),
        ], $response->status());
    }
}
