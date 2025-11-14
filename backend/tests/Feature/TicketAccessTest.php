<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_reporter_sees_only_their_tickets()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        $response = $this->getJson('/api/tickets');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $ticket) {
            $this->assertEquals($reporter->id, $ticket['reporter']['id']);
        }
    }

    public function test_agent_sees_all_tickets()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $response = $this->getJson('/api/tickets');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertGreaterThan(1, count($data));
    }
}
