<?php

namespace App\Repositories;

use App\Contracts\TicketStatusChangeRepositoryInterface;
use App\Models\Ticket;
use App\Models\TicketStatusChange;
use Illuminate\Support\Collection;

class EloquentTicketStatusChangeRepository implements TicketStatusChangeRepositoryInterface
{
    public function listForTicket(Ticket $ticket): Collection
    {
        return TicketStatusChange::query()
            ->where('ticket_id', $ticket->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->get();
    }
}
