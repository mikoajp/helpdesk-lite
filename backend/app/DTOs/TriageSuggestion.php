<?php

namespace App\DTOs;

readonly class TriageSuggestion implements \ArrayAccess, \JsonSerializable
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

    // ArrayAccess implementation (read-only)
    public function offsetExists($offset): bool { return array_key_exists($offset, $this->toArray()); }
    public function offsetGet($offset): mixed { return $this->toArray()[$offset] ?? null; }
    public function offsetSet($offset, $value): void { throw new \LogicException('TriageSuggestion is read-only'); }
    public function offsetUnset($offset): void { throw new \LogicException('TriageSuggestion is read-only'); }

    // JsonSerializable
    public function jsonSerialize(): mixed { return $this->toArray(); }
}

