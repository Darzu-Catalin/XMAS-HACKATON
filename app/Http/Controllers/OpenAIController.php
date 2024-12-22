<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;


class OpenAIController extends Controller
{
    public function processLetter(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'text' => 'required|string',
        ]);

        $letterText = $request->input('text');

        // Define the prompt for OpenAI
        $prompt = <<<EOT
Extract the following information from the letter:
- Name of the child
- Address
- List of presents wanted
- Kindness value (a number between 0 and 1, where 0 is not kind and 1 is very kind)

Provide the output in JSON format as shown below:

{
  "name": "",
  "address": "",
  "presents_wanted": [],
  "kindness": 0.0
}

Letter:
$letterText
EOT;

        try {
            // Make the API request to OpenAI
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->withOptions(["verify"=>false])
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => 'gpt-4', // You can choose a different model if desired
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'You are an assistant that extracts structured data from children\'s letters to Santa.',
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt,
                    ],
                ],
                'temperature' => 0.2, // Low temperature for deterministic output
                'max_tokens' => 300,
            ]);

            if ($response->successful()) {
                $responseData = $response->json();

                // Extract the content from the response
                $content = $responseData['choices'][0]['message']['content'] ?? '';

                // Attempt to decode the JSON
                $extractedData = json_decode($content, true);

                if (json_last_error() === JSON_ERROR_NONE) {
                    // Validate the extracted data
                    $validator = Validator::make($extractedData, [
                        'name' => 'required|string',
                        'address' => 'required|string',
                        'presents_wanted' => 'required|array',
                        'kindness' => 'required|numeric|min:0|max:1',
                    ]);

                    if ($validator->fails()) {
                        return response()->json([
                            'error' => 'Invalid data format received from OpenAI.',
                            'details' => $validator->errors(),
                            'raw_response' => $content,
                        ], 422);
                    }

                    return response()->json($extractedData, 200);
                } else {
                    // Handle JSON decoding errors
                    Log::error('JSON Decode Error:', [
                        'error' => json_last_error_msg(),
                        'response_content' => $content,
                    ]);

                    return response()->json([
                        'error' => 'Failed to parse JSON from OpenAI response.',
                        'raw_response' => $content,
                    ], 500);
                }
            } else {
                // Handle unsuccessful responses
                Log::error('OpenAI API Error:', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'error' => 'Failed to communicate with OpenAI API.',
                    'details' => $response->json(),
                ], $response->status());
            }
        } catch (\Exception $e) {
            // Handle exceptions
            Log::error('Exception during OpenAI API call:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'error' => 'An unexpected error occurred.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
