<?php

namespace App\Services;

use App\Contracts\ExternalUserServiceInterface;
use App\Models\Ticket;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExternalUserService implements ExternalUserServiceInterface
{
    private const BASE_URL = 'https://jsonplaceholder.typicode.com/users';
    private const TIMEOUT = 5; // seconds

    public function getUserForTicket(Ticket $ticket): array
    {
        // Simple mapping: pick reporter_id modulo 10 (JSONPlaceholder has 10 users)
        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;

        try {
            $response = Http::timeout(self::TIMEOUT)->get(self::BASE_URL . '/' . $placeholderId);
            if (!$response->successful()) {
                Log::warning('ExternalUserService: HTTP failure', [
                    'ticket_id' => $ticket->id,
                    'status' => $response->status(),
                ]);
                return [
                    'success' => false,
                    'ticket_id' => $ticket->id,
                    'error' => [
                        'code' => 'external_user_http_error',
                        'message' => 'Failed to fetch external user',
                        'status' => $response->status(),
                    ],
                ];
            }
            $user = $response->json();
            return [
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