<?php

namespace App\Policies;

use App\Enums\RoleName;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function view(User $user, Ticket $ticket): bool
    {
        if ($user->role?->name === RoleName::ADMIN->value || $user->role?->name === RoleName::AGENT->value) {
            return true;
        }
        return $ticket->reporter_id === $user->id;
    }

    public function update(User $user, Ticket $ticket): bool
    {
        if ($user->role?->name === RoleName::ADMIN->value) {
            return true;
        }
        if ($user->role?->name === RoleName::AGENT->value) {
            return true;
        }
        return $ticket->reporter_id === $user->id;
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $this->update($user, $ticket);
    }
}
