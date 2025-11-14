<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HealthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
    }

    public function test_ping_endpoint_returns_ok()
    {
        $response = $this->getJson('/api/ping');
        $response->assertStatus(200)->assertJsonFragment(['status' => 'ok']);
    }
}
