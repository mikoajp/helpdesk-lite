<?php

namespace App\Contracts;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TicketRepositoryInterface
{
    /**
     * @param User $user
     * @param array{status?:string,priority?:string,assignee_id?:int,tag?:string,limit?:int} $filters
     * @return Collection<int,Ticket>
     */
    public function listForUser(User $user, array $filters = []): Collection;
}
