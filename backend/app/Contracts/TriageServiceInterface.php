<?php

namespace App\Contracts;

use App\DTOs\TriageSuggestion;
use App\Models\Ticket;

interface TriageServiceInterface
{
    /** @return array */
    public function suggestTriage(Ticket $ticket): array;
}
