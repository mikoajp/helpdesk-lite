<?php

namespace App\Contracts;

use App\Models\Ticket;

interface ExternalUserServiceInterface
{
    /**
     * Fetch external user data related to a ticket.
     * Returns associative array with success flag and data or error.
     * @param Ticket $ticket
     * @return array{success:bool,ticket_id:int,user?:array,error?:array}
     */
    public function getUserForTicket(Ticket $ticket): array;
}