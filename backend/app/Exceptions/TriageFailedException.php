<?php

namespace App\Exceptions;

use Exception;

class TriageFailedException extends Exception
{
    public function __construct(string $message = 'Failed to generate triage suggestion', array $context = [], int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->context = $context;
    }

    public array $context = [];
}
