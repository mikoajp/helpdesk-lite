<?php

namespace App\Services;

use App\Contracts\ExternalUserServiceInterface;
use App\Models\Ticket;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class ExternalUserService implements ExternalUserServiceInterface
{
    private const BASE_URL = 'https://jsonplaceholder.typicode.com/users';
    private const TIMEOUT = 5; // seconds

    public function getUserForTicket(Ticket $ticket): array
    {
        // Simple mapping: pick reporter_id modulo 10 (JSONPlaceholder has 10 users)
        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;
        $cacheKey = 'external_user_ticket_' . $ticket->id;

        // Return cached value if present (cache TTL 5 minutes)
        if ($cached = Cache::get($cacheKey)) {
            $cached['source'] = 'cache';
            return $cached;
        }

        try {
            $response = Http::timeout(self::TIMEOUT)->get(self::BASE_URL . '/' . $placeholderId);
            if ($response->status() === 403) {
                // Treat 403 as service unavailable; provide graceful fallback derived from local reporter data
                $reporter = $ticket->reporter;
                Log::warning('ExternalUserService: forbidden (403) - using reporter fallback', [
                    'ticket_id' => $ticket->id,
                ]);
                $fallback = [
                    'success' => true, // still success - we deliver synthesized data
                    'ticket_id' => $ticket->id,
                    'user' => [
                        'id' => $reporter?->id ?? 0,
                        'name' => $reporter?->name,
                        'username' => $reporter?->name,
                        'email' => $reporter?->email,
                        'company' => null,
                        'source' => 'local-fallback',
                    ],
                ];
                Cache::put($cacheKey, $fallback, now()->addMinutes(5));
                return $fallback;
            }

            if (!$response->successful()) {
                Log::warning('ExternalUserService: HTTP failure', [
                    'ticket_id' => $ticket->id,
                    'status' => $response->status(),
                ]);

                // Fallback to minimal data if available (only reporter basics) - not cached
                $fallback = [
                    'success' => false,
                    'ticket_id' => $ticket->id,
                    'error' => [
                        'code' => 'external_user_http_error',
                        'message' => 'Failed to fetch external user',
                        'status' => $response->status(),
                    ],
                ];
                return $fallback;
            }
            $user = $response->json();
            $result = [
                'success' => true,
                'ticket_id' => $ticket->id,
                'user' => [
                    'id' => $user['id'] ?? $placeholderId,
                    'name' => $user['name'] ?? null,
                    'username' => $user['username'] ?? null,
                    'email' => $user['email'] ?? null,
                    'company' => $user['company']['name'] ?? null,
                    'source' => 'jsonplaceholder',
                ],
            ];
            Cache::put($cacheKey, $result, now()->addMinutes(5));
            return $result;
        } catch (\Throwable $e) {
            Log::error('ExternalUserService: exception', [
                'ticket_id' => $ticket->id,
                'exception' => $e->getMessage(),
            ]);
            return [
                'success' => false,
                'ticket_id' => $ticket->id,
                'error' => [
                    'code' => 'external_user_exception',
                    'message' => 'Unexpected error fetching external user',
                    'details' => $e->getMessage(),
                ],
            ];
        }
    }
}