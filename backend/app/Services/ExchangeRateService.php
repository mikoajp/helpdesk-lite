<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

use App\Contracts\ExchangeRateServiceInterface;

class ExchangeRateService implements ExchangeRateServiceInterface
{
    private const API_BASE_URL = 'https://api.exchangerate.host';
    private const CACHE_TTL = 300; // 5 minutes in seconds
    private const CACHE_PREFIX = 'exchange_rate_';
    private const FALLBACK_KEY = 'exchange_rate_last_successful';
    private const TIMEOUT = 10; // seconds

    /**
     * Fetch exchange rates from ExchangeRate.host API
     *
     * @param string $base Base currency (default: USD)
     * @param array $symbols Array of target currencies
     * @return array Response with rates or error
     */
    public function getRates(string $base = 'USD', array $symbols = []): array
    {
        $cacheKey = $this->getCacheKey($base, $symbols);

        // Try to get from cache first
        $cachedData = Cache::get($cacheKey);
        if ($cachedData) {
            Log::info('ExchangeRate: Returning cached data', [
                'base' => $base,
                'symbols' => $symbols,
            ]);
            return array_merge($cachedData, ['cached' => true]);
        }

        // Fetch from API
        try {
            $response = $this->fetchFromApi($base, $symbols);

            if ($response['success']) {
                // Cache successful response
                Cache::put($cacheKey, $response, self::CACHE_TTL);
                
                // Store as fallback
                Cache::put(self::FALLBACK_KEY, $response, now()->addDays(7));
                
                Log::info('ExchangeRate: API call successful', [
                    'base' => $base,
                    'symbols' => $symbols,
                ]);

                return array_merge($response, ['cached' => false]);
            }

            // API returned error
            Log::warning('ExchangeRate: API returned error', [
                'base' => $base,
                'symbols' => $symbols,
                'error' => $response['error'] ?? 'Unknown error',
            ]);

            return $this->useFallback($base, $symbols, $response['error'] ?? 'API returned error');

        } catch (\Exception $e) {
            Log::error('ExchangeRate: API call failed', [
                'base' => $base,
                'symbols' => $symbols,
                'exception' => $e->getMessage(),
            ]);

            return $this->useFallback($base, $symbols, $e->getMessage());
        }
    }

    /**
     * Fetch rates from external API
     *
     * @param string $base
     * @param array $symbols
     * @return array
     * @throws \Exception
     */
    private function fetchFromApi(string $base, array $symbols): array
    {
        $url = self::API_BASE_URL . '/latest';
        
        $params = [
            'base' => $base,
        ];

        if (!empty($symbols)) {
            $params['symbols'] = implode(',', $symbols);
        }

        $response = Http::timeout(self::TIMEOUT)
            ->retry(2, 100) // Retry 2 times with 100ms delay
            ->get($url, $params);

        if (!$response->successful()) {
            throw new \Exception("HTTP {$response->status()}: {$response->body()}");
        }

        $data = $response->json();

        // ExchangeRate.host returns success: true/false
        if (isset($data['success']) && $data['success'] === false) {
            return [
                'success' => false,
                'error' => $data['error']['info'] ?? 'Unknown API error',
            ];
        }

        return [
            'success' => true,
            'base' => $data['base'] ?? $base,
            'date' => $data['date'] ?? now()->toDateString(),
            'rates' => $data['rates'] ?? [],
        ];
    }

    /**
     * Use fallback data when API fails
     *
     * @param string $base
     * @param array $symbols
     * @param string $errorMessage
     * @return array
     */
    private function useFallback(string $base, array $symbols, string $errorMessage): array
    {
        $fallback = Cache::get(self::FALLBACK_KEY);

        if ($fallback) {
            Log::info('ExchangeRate: Using fallback data', [
                'base' => $base,
                'symbols' => $symbols,
            ]);

            return array_merge($fallback, [
                'cached' => true,
                'fallback' => true,
                'warning' => 'Using cached data due to API failure: ' . $errorMessage,
            ]);
        }

        // No fallback available
        Log::error('ExchangeRate: No fallback data available', [
            'base' => $base,
            'symbols' => $symbols,
        ]);

        // Static fallback in local/dev or when enabled via config
        if (config('exchange.use_static_fallback')) {
            $static = config('exchange.static_fallback');
            if (is_array($static) && !empty($static['rates'] ?? [])) {
                return [
                    'success' => true,
                    'base' => $static['base'] ?? $base,
                    'date' => now()->toDateString(),
                    'rates' => $static['rates'],
                    'cached' => true,
                    'fallback' => true,
                    'warning' => 'Using static fallback due to API failure: ' . $errorMessage,
                ];
            }
        }

        return [
            'success' => false,
            'error' => [
                'code' => 'api_unavailable',
                'message' => 'Exchange rate API is currently unavailable and no cached data is available.',
                'details' => $errorMessage,
            ],
        ];
    }

    /**
     * Generate cache key
     *
     * @param string $base
     * @param array $symbols
     * @return string
     */
    private function getCacheKey(string $base, array $symbols): string
    {
        sort($symbols);
        return self::CACHE_PREFIX . $base . '_' . implode('_', $symbols);
    }

    /**
     * Clear cache for specific rates
     *
     * @param string|null $base
     * @param array $symbols
     * @return void
     */
    public function clearCache(?string $base = null, array $symbols = []): void
    {
        if ($base) {
            $cacheKey = $this->getCacheKey($base, $symbols);
            Cache::forget($cacheKey);
        } else {
            // Clear all exchange rate cache
            Cache::flush();
        }
    }
}
