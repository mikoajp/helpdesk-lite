<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TriageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_triage_suggest_endpoint_returns_suggestion()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'ticket_id',
                'suggested_priority',
                'suggested_status',
                'summary',
                'confidence',
                'method',
            ]);

        $this->assertEquals($ticket->id, $response->json('ticket_id'));
        $this->assertIsFloat($response->json('confidence'));
        $this->assertGreaterThanOrEqual(0, $response->json('confidence'));
        $this->assertLessThanOrEqual(1, $response->json('confidence'));
    }

    public function test_triage_suggest_requires_authentication()
    {
        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(401);
    }

    public function test_triage_suggest_respects_authorization()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        // Try to access ticket that doesn't belong to reporter
        $otherTicket = Ticket::where('reporter_id', '!=', $reporter->id)->first();

        if ($otherTicket) {
            $response = $this->postJson("/api/tickets/{$otherTicket->id}/triage-suggest");
            $response->assertStatus(403);
        } else {
            $this->markTestSkipped('No ticket from another reporter available');
        }
    }

    public function test_triage_suggest_returns_404_for_nonexistent_ticket()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $response = $this->postJson('/api/tickets/99999/triage-suggest');

        $response->assertStatus(404);
    }

    public function test_triage_suggest_suggests_high_priority_for_urgent_tickets()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create ticket with urgent keywords
        $ticket = Ticket::create([
            'title' => 'Critical system down',
            'description' => 'The entire system is down and users cannot login. This is urgent!',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $agent->id,
            'tags' => ['urgent', 'critical'],
        ]);

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $this->assertEquals('high', $response->json('suggested_priority'));
    }

    public function test_triage_suggest_suggests_low_priority_for_feature_requests()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create ticket for feature request
        $ticket = Ticket::create([
            'title' => 'Feature request: dark mode',
            'description' => 'It would be nice to have a dark mode. This is just a suggestion.',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $agent->id,
            'tags' => ['feature', 'enhancement'],
        ]);

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $this->assertEquals('low', $response->json('suggested_priority'));
    }

    public function test_triage_suggest_suggests_in_progress_when_assignee_is_set()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        $admin = User::where('email', 'admin@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create ticket with assignee but status is open
        $ticket = Ticket::create([
            'title' => 'Bug in login form',
            'description' => 'Users are reporting issues with login.',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $agent->id,
            'assignee_id' => $admin->id,
        ]);

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $this->assertEquals('in_progress', $response->json('suggested_status'));
    }

    public function test_triage_suggest_returns_valid_priority_values()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $priority = $response->json('suggested_priority');
        $this->assertContains($priority, ['low', 'medium', 'high']);
    }

    public function test_triage_suggest_returns_valid_status_values()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $status = $response->json('suggested_status');
        $this->assertContains($status, ['open', 'in_progress', 'resolved', 'closed']);
    }

    public function test_triage_suggest_includes_summary()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $this->assertIsString($response->json('summary'));
        $this->assertNotEmpty($response->json('summary'));
    }

    public function test_triage_suggest_uses_rules_method_by_default()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
        $this->assertEquals('rules', $response->json('method'));
    }

    public function test_reporter_can_access_triage_for_own_ticket()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        // Get reporter's own ticket
        $ticket = Ticket::where('reporter_id', $reporter->id)->first();

        $response = $this->postJson("/api/tickets/{$ticket->id}/triage-suggest");

        $response->assertStatus(200);
    }
}
