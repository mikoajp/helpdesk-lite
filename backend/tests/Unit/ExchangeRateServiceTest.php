<?php

namespace Tests\Unit;

use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExchangeRateServiceTest extends TestCase
{
    private ExchangeRateService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ExchangeRateService();
        Cache::flush();
    }

    public function test_get_rates_returns_successful_response()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => [
                    'EUR' => 0.92,
                    'PLN' => 4.05,
                ],
            ], 200),
        ]);

        $result = $this->service->getRates('USD', ['EUR', 'PLN']);

        $this->assertTrue($result['success']);
        $this->assertEquals('USD', $result['base']);
        $this->assertArrayHasKey('rates', $result);
        $this->assertArrayHasKey('EUR', $result['rates']);
        $this->assertArrayHasKey('PLN', $result['rates']);
        $this->assertFalse($result['cached']);
    }

    public function test_get_rates_caches_successful_response()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => [
                    'EUR' => 0.92,
                ],
            ], 200),
        ]);

        // First call
        $result1 = $this->service->getRates('USD', ['EUR']);
        $this->assertFalse($result1['cached']);

        // Second call should use cache
        $result2 = $this->service->getRates('USD', ['EUR']);
        $this->assertTrue($result2['cached']);

        // HTTP should be called only once
        Http::assertSentCount(1);
    }

    public function test_get_rates_stores_fallback_on_success()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => [
                    'EUR' => 0.92,
                ],
            ], 200),
        ]);

        $this->service->getRates('USD', ['EUR']);

        // Verify fallback was stored
        $fallback = Cache::get('exchange_rate_last_successful');
        $this->assertNotNull($fallback);
        $this->assertTrue($fallback['success']);
    }

    public function test_get_rates_uses_fallback_on_api_failure()
    {
        // Manually set fallback data (simulating previous successful request)
        Cache::put('exchange_rate_last_successful', [
            'success' => true,
            'base' => 'USD',
            'date' => '2025-11-15',
            'rates' => [
                'EUR' => 0.92,
            ],
        ], now()->addDays(7));

        // Make API fail
        Http::fake([
            'api.exchangerate.host/*' => Http::response([], 500),
        ]);

        $result = $this->service->getRates('USD', ['EUR']);

        $this->assertTrue($result['success']);
        $this->assertTrue($result['cached']);
        $this->assertTrue($result['fallback']);
        $this->assertArrayHasKey('warning', $result);
    }

    public function test_get_rates_returns_error_when_no_fallback()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([], 500),
        ]);

        $result = $this->service->getRates('USD', ['EUR']);

        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('error', $result);
        $this->assertEquals('api_unavailable', $result['error']['code']);
    }

    public function test_get_rates_handles_timeout()
    {
        Http::fake([
            'api.exchangerate.host/*' => function () {
                throw new \Illuminate\Http\Client\ConnectionException('Connection timeout');
            },
        ]);

        $result = $this->service->getRates('USD', ['EUR']);

        $this->assertFalse($result['success']);
        $this->assertArrayHasKey('error', $result);
    }

    public function test_get_rates_handles_api_error_response()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => false,
                'error' => [
                    'code' => 'invalid_base',
                    'info' => 'Invalid base currency',
                ],
            ], 200),
        ]);

        $result = $this->service->getRates('XXX', ['EUR']);

        $this->assertFalse($result['success']);
    }

    public function test_get_rates_retries_on_failure()
    {
        // Test that retry mechanism is configured (will succeed on retry)
        Http::fake([
            'api.exchangerate.host/*' => Http::sequence()
                ->push([], 500) // First attempt fails
                ->push([  // Retry succeeds
                    'success' => true,
                    'base' => 'USD',
                    'date' => '2025-11-15',
                    'rates' => ['EUR' => 0.92],
                ], 200),
        ]);

        $result = $this->service->getRates('USD', ['EUR']);

        // Should eventually succeed after retry
        $this->assertTrue($result['success']);
        $this->assertEquals(0.92, $result['rates']['EUR']);
        
        // Verify at least 2 requests were made (original + retry)
        Http::assertSentCount(2);
    }

    public function test_clear_cache_removes_cached_data()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => ['EUR' => 0.92],
            ], 200),
        ]);

        // Cache data
        $this->service->getRates('USD', ['EUR']);
        
        // Clear cache
        $this->service->clearCache('USD', ['EUR']);

        // Next call should hit API again
        $result = $this->service->getRates('USD', ['EUR']);
        
        $this->assertFalse($result['cached']);
        Http::assertSentCount(2); // Once before clear, once after
    }

    public function test_cache_key_generation_is_consistent()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => ['EUR' => 0.92, 'PLN' => 4.05],
            ], 200),
        ]);

        // Different order of symbols should produce same cache key
        $this->service->getRates('USD', ['PLN', 'EUR']);
        $result = $this->service->getRates('USD', ['EUR', 'PLN']);

        $this->assertTrue($result['cached']); // Should use cached data
        Http::assertSentCount(1); // Only one API call
    }

    public function test_different_base_currencies_have_separate_cache()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => ['EUR' => 0.92],
            ], 200),
        ]);

        $this->service->getRates('USD', ['EUR']);
        $this->service->getRates('EUR', ['USD']);

        // Should make 2 API calls (different cache keys)
        Http::assertSentCount(2);
    }

    public function test_get_rates_with_empty_symbols_array()
    {
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => true,
                'base' => 'USD',
                'date' => '2025-11-15',
                'rates' => [
                    'EUR' => 0.92,
                    'GBP' => 0.79,
                    'JPY' => 149.50,
                ],
            ], 200),
        ]);

        $result = $this->service->getRates('USD', []);

        $this->assertTrue($result['success']);
        $this->assertArrayHasKey('rates', $result);
        // When no symbols specified, API returns all available rates
    }
}
