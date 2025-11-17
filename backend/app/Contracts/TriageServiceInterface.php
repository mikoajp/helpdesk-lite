<?php

namespace App\Contracts;

use App\DTOs\TriageSuggestion;
use App\Models\Ticket;

interface TriageServiceInterface
{
    public function suggestTriage(Ticket $ticket): TriageSuggestion;
}
