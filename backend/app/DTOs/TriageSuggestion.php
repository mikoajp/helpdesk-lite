<?php

namespace App\DTOs;

readonly class TriageSuggestion
{
    public function __construct(
        public int $ticketId,
        public string $suggestedPriority,
        public string $suggestedStatus,
        public string $summary,
        public float $confidence,
        public string $method,
        public ?string $reasoning = null,
        public ?bool $fallback = null,
        public ?string $fallbackReason = null,
    ) {}

    public function toArray(): array
    {
        return [
            'ticket_id' => $this->ticketId,
            'suggested_priority' => $this->suggestedPriority,
            'suggested_status' => $this->suggestedStatus,
            'summary' => $this->summary,
            'confidence' => $this->confidence,
            'method' => $this->method,
            'reasoning' => $this->reasoning,
            'fallback' => $this->fallback,
            'fallback_reason' => $this->fallbackReason,
        ];
    }
}
