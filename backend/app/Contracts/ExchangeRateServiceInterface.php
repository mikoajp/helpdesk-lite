<?php

namespace App\Contracts;

interface ExchangeRateServiceInterface
{
    /**
     * @param string $base
     * @param array $symbols
     * @return array{success:bool,base?:string,date?:string,rates?:array,cached?:bool,fallback?:bool,warning?:string,error?:mixed}
     */
    public function getRates(string $base = 'USD', array $symbols = []): array;

    public function clearCache(?string $base = null, array $symbols = []): void;
}
