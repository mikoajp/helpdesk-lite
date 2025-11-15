<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExternalDataTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
        Cache::flush(); // Clear cache before each test
    }

    public function test_external_data_endpoint_returns_exchange_rates_on_success()
    {
        // Mock successful API response
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

        $user = User::first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'base',
                'date',
                'rates' => ['EUR', 'PLN'],
                'cached',
            ])
            ->assertJson([
                'success' => true,
                'base' => 'USD',
                'cached' => false,
            ]);

        $this->assertArrayHasKey('EUR', $response->json('rates'));
        $this->assertArrayHasKey('PLN', $response->json('rates'));
    }

    public function test_external_data_endpoint_uses_cache_on_second_request()
    {
        // Mock successful API response
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

        $user = User::first();
        Sanctum::actingAs($user);

        // First request - should hit API
        $response1 = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');
        $response1->assertStatus(200)
            ->assertJson(['cached' => false]);

        // Second request - should use cache
        $response2 = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');
        $response2->assertStatus(200)
            ->assertJson(['cached' => true]);

        // Verify HTTP was called only once
        Http::assertSentCount(1);
    }

    public function test_external_data_endpoint_uses_fallback_on_api_failure()
    {
        $user = User::first();
        Sanctum::actingAs($user);

        // Manually set fallback data (simulating a previous successful request)
        Cache::put('exchange_rate_last_successful', [
            'success' => true,
            'base' => 'USD',
            'date' => '2025-11-15',
            'rates' => [
                'EUR' => 0.92,
                'PLN' => 4.05,
            ],
        ], now()->addDays(7));

        // Mock API failure
        Http::fake([
            'api.exchangerate.host/*' => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');
        
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'cached' => true,
                'fallback' => true,
            ])
            ->assertJsonStructure(['warning']);

        $this->assertArrayHasKey('EUR', $response->json('rates'));
        $this->assertArrayHasKey('PLN', $response->json('rates'));
    }

    public function test_external_data_endpoint_returns_error_when_no_fallback_available()
    {
        // Mock API failure
        Http::fake([
            'api.exchangerate.host/*' => Http::response([], 500),
        ]);

        $user = User::first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');

        $response->assertStatus(503)
            ->assertJson([
                'success' => false,
            ])
            ->assertJsonStructure([
                'error' => ['code', 'message', 'details'],
            ]);
    }

    public function test_external_data_endpoint_handles_timeout()
    {
        // Mock timeout
        Http::fake([
            'api.exchangerate.host/*' => function () {
                throw new \Illuminate\Http\Client\ConnectionException('Connection timeout');
            },
        ]);

        $user = User::first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');

        $response->assertStatus(503)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_external_data_endpoint_validates_input()
    {
        $user = User::first();
        Sanctum::actingAs($user);

        // Test invalid base (not 3 characters)
        $response = $this->getJson('/api/external-data?base=USDD');
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['base']);

        // Test invalid base (contains numbers)
        $response = $this->getJson('/api/external-data?base=US1');
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['base']);
    }

    public function test_external_data_endpoint_requires_authentication()
    {
        $response = $this->getJson('/api/external-data?base=USD&symbols=EUR,PLN');
        
        $response->assertStatus(401);
    }

    public function test_external_data_endpoint_uses_default_parameters()
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

        $user = User::first();
        Sanctum::actingAs($user);

        // Call without parameters
        $response = $this->getJson('/api/external-data');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'base' => 'USD',
            ]);

        // Verify the response contains EUR and PLN rates
        $this->assertArrayHasKey('EUR', $response->json('rates'));
        $this->assertArrayHasKey('PLN', $response->json('rates'));
    }

    public function test_external_data_handles_api_error_response()
    {
        // Mock API returning error in response body
        Http::fake([
            'api.exchangerate.host/*' => Http::response([
                'success' => false,
                'error' => [
                    'code' => 'invalid_base_currency',
                    'info' => 'The base currency is not valid.',
                ],
            ], 200),
        ]);

        $user = User::first();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/external-data?base=XXX&symbols=EUR');

        // Should still work if fallback is available, or return 503
        $this->assertContains($response->status(), [200, 503]);
    }
}
