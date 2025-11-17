<?php

namespace App\DTOs;

readonly class TicketFilter
{
    public function __construct(
        public ?string $status = null,
        public ?string $priority = null,
        public ?int $assigneeId = null,
        public ?string $tag = null,
        public int $limit = 50,
    ) {}
}
