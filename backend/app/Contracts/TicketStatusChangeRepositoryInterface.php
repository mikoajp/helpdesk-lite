<?php

namespace App\Contracts;

use App\Models\Ticket;
use App\Models\TicketStatusChange;
use Illuminate\Support\Collection;

interface TicketStatusChangeRepositoryInterface
{
    /**
     * @return Collection<int,TicketStatusChange>
     */
    public function listForTicket(Ticket $ticket): Collection;
}
