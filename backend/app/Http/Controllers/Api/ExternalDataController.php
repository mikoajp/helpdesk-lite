<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExchangeRateService;
use App\Http\Requests\External\GetExchangeRatesRequest;
use Illuminate\Http\Request;

class ExternalDataController extends Controller
{
    private ExchangeRateService $exchangeRateService;

    public function __construct(ExchangeRateService $exchangeRateService)
    {
        $this->exchangeRateService = $exchangeRateService;
    }

    /**
     * Get exchange rates from external API
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getExchangeRates(GetExchangeRatesRequest $request)
    {
        $validated = $request->validated();

        $base = $validated['base'] ?? config('exchange.default_base', 'USD');
        $symbolsString = $validated['symbols'] ?? config('exchange.default_symbols', 'EUR,PLN');
        
        // Parse symbols from comma-separated string
        $symbols = array_map('trim', explode(',', $symbolsString));
        $symbols = array_filter($symbols); // Remove empty values

        $result = $this->exchangeRateService->getRates($base, $symbols);

        if (!$result['success']) {
            return response()->json($result, 503);
        }

        return response()->json($result);
    }
}
