<?php

namespace App\Exceptions;

use Exception;

class ExchangeRateUnavailableException extends Exception
{
    public function __construct(string $message = 'Exchange rates unavailable', array $context = [], int $code = 0, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->context = $context;
    }

    public array $context = [];
}
