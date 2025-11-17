<?php

namespace App\Contracts;

use App\Models\Ticket;
use App\Models\User;
use App\DTOs\TicketFilter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TicketRepositoryInterface
{
    /**
     * @param User $user
     * @param TicketFilter $filters
     * @return Collection<int,Ticket>
     */
    public function listForUser(User $user, TicketFilter $filters): Collection;
}
