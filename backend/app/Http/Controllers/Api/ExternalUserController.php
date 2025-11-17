<?php

namespace App\Http\Controllers\Api;

use App\Contracts\ExternalUserServiceInterface;
use App\Http\Controllers\Controller;
use App\Models\Ticket;

class ExternalUserController extends Controller
{
    public function __construct(private ExternalUserServiceInterface $externalUserService) {}

    /**
     * Get external user data mapped to ticket reporter.
     */
    public function show(int $id)
    {
        $ticket = Ticket::findOrFail($id);
        $result = $externalUserServiceResult = $this->externalUserService->getUserForTicket($ticket);
        $status = ($result['success'] ?? false) ? 200 : 503;
        return response()->json($result, $status);
    }
}