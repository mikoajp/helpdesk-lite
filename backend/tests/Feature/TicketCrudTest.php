<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_can_create_ticket()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        $payload = [
            'title' => 'New issue',
            'description' => 'This is a test issue',
            'priority' => 'high',
            'assignee_id' => $agent->id,
            'tags' => ['bug', 'urgent'],
        ];

        $response = $this->postJson('/api/tickets', $payload);
        
        $response->assertStatus(201)
            ->assertJsonStructure([
                'id', 'title', 'description', 'priority', 'status',
                'reporter', 'assignee', 'tags', 'created_at', 'updated_at'
            ])
            ->assertJson([
                'title' => 'New issue',
                'description' => 'This is a test issue',
                'priority' => 'high',
                'status' => 'open',
                'tags' => ['bug', 'urgent'],
            ]);

        $this->assertDatabaseHas('tickets', [
            'title' => 'New issue',
            'reporter_id' => $reporter->id,
            'assignee_id' => $agent->id,
        ]);

        // Verify status change was created
        $ticketId = $response->json('id');
        $this->assertDatabaseHas('ticket_status_changes', [
            'ticket_id' => $ticketId,
            'old_status' => null,
            'new_status' => 'open',
        ]);
    }

    public function test_can_update_ticket_and_status_change_is_recorded()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();
        $oldStatus = $ticket->status;

        $response = $this->putJson("/api/tickets/{$ticket->id}", [
            'status' => 'in_progress',
            'title' => 'Updated title',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'id' => $ticket->id,
                'title' => 'Updated title',
                'status' => 'in_progress',
            ]);

        // Verify status change was recorded
        $this->assertDatabaseHas('ticket_status_changes', [
            'ticket_id' => $ticket->id,
            'old_status' => $oldStatus,
            'new_status' => 'in_progress',
            'user_id' => $agent->id,
        ]);

        // Verify there are at least 2 status changes (create + update)
        $statusChanges = \App\Models\TicketStatusChange::where('ticket_id', $ticket->id)->get();
        $this->assertGreaterThanOrEqual(2, $statusChanges->count());
    }

    public function test_can_get_single_ticket_with_status_changes()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id', 'title', 'description', 'priority', 'status',
                'reporter', 'assignee', 'tags', 'created_at', 'updated_at',
                'status_changes' => [
                    '*' => ['id', 'old_status', 'new_status', 'user', 'created_at']
                ]
            ]);

        $this->assertNotEmpty($response->json('status_changes'));
    }

    public function test_can_get_ticket_status_changes()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();

        $response = $this->getJson("/api/tickets/{$ticket->id}/status-changes");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'old_status', 'new_status', 'user', 'created_at']
                ]
            ]);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_can_delete_ticket()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $ticket = Ticket::first();
        $ticketId = $ticket->id;

        $response = $this->deleteJson("/api/tickets/{$ticketId}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tickets', ['id' => $ticketId]);
    }

    public function test_reporter_cannot_see_other_users_ticket()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        // Find a ticket NOT owned by this reporter
        $otherTicket = Ticket::where('reporter_id', '!=', $reporter->id)->first();

        if ($otherTicket) {
            $response = $this->getJson("/api/tickets/{$otherTicket->id}");
            $response->assertStatus(403);
        } else {
            $this->markTestSkipped('No ticket from another reporter available');
        }
    }

    public function test_reporter_cannot_update_other_users_ticket()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        // Find a ticket NOT owned by this reporter
        $otherTicket = Ticket::where('reporter_id', '!=', $reporter->id)->first();

        if ($otherTicket) {
            $response = $this->putJson("/api/tickets/{$otherTicket->id}", [
                'title' => 'Trying to update',
            ]);
            $response->assertStatus(403);
        } else {
            $this->markTestSkipped('No ticket from another reporter available');
        }
    }

    public function test_validation_fails_for_invalid_priority()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        $response = $this->postJson('/api/tickets', [
            'title' => 'Test',
            'description' => 'Test description',
            'priority' => 'invalid_priority',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['priority']);
    }

    public function test_validation_fails_for_missing_required_fields()
    {
        $reporter = User::where('email', 'reporter@helpdesk.com')->first();
        Sanctum::actingAs($reporter);

        $response = $this->postJson('/api/tickets', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'priority']);
    }
}
