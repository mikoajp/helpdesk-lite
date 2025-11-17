<?php

namespace App\Repositories;

use App\Contracts\TicketRepositoryInterface;
use App\DTOs\TicketFilter;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Collection;

class EloquentTicketRepository implements TicketRepositoryInterface
{
    public function listForUser(User $user, TicketFilter $filters): Collection
    {
        $query = Ticket::query()
            ->with(['reporter.role', 'assignee.role'])
            ->forUser($user)
            ->byStatus($filters->status)
            ->byPriority($filters->priority)
            ->byAssignee($filters->assigneeId)
            ->byTag($filters->tag)
            ->orderByDesc('created_at');

        return $query->limit($filters->limit)->get();
    }
}
