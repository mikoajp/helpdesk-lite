<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TicketFilterTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_can_filter_tickets_by_status()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create tickets with different statuses
        Ticket::factory()->create(['status' => 'open', 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['status' => 'in_progress', 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['status' => 'resolved', 'reporter_id' => $agent->id]);

        $response = $this->getJson('/api/tickets?status=open');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        foreach ($data as $ticket) {
            $this->assertEquals('open', $ticket['status']);
        }
    }

    public function test_can_filter_tickets_by_priority()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create tickets with different priorities
        Ticket::factory()->create(['priority' => 'low', 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['priority' => 'high', 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['priority' => 'medium', 'reporter_id' => $agent->id]);

        $response = $this->getJson('/api/tickets?priority=high');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        foreach ($data as $ticket) {
            $this->assertEquals('high', $ticket['priority']);
        }
    }

    public function test_can_filter_tickets_by_assignee()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        $admin = User::where('email', 'admin@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create tickets with different assignees
        Ticket::factory()->create(['assignee_id' => $agent->id, 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['assignee_id' => $admin->id, 'reporter_id' => $agent->id]);
        Ticket::factory()->create(['assignee_id' => null, 'reporter_id' => $agent->id]);

        $response = $this->getJson("/api/tickets?assignee_id={$agent->id}");

        $response->assertStatus(200);
        $data = $response->json('data');
        
        foreach ($data as $ticket) {
            if ($ticket['assignee']) {
                $this->assertEquals($agent->id, $ticket['assignee']['id']);
            }
        }
    }

    public function test_can_filter_tickets_by_tag()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create tickets with different tags
        Ticket::factory()->create([
            'tags' => ['bug', 'urgent'],
            'reporter_id' => $agent->id
        ]);
        Ticket::factory()->create([
            'tags' => ['feature', 'enhancement'],
            'reporter_id' => $agent->id
        ]);
        Ticket::factory()->create([
            'tags' => ['bug', 'low-priority'],
            'reporter_id' => $agent->id
        ]);

        $response = $this->getJson('/api/tickets?tag=bug');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertNotEmpty($data);
        foreach ($data as $ticket) {
            $this->assertContains('bug', $ticket['tags']);
        }
    }

    public function test_can_combine_multiple_filters()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        // Create specific ticket
        Ticket::factory()->create([
            'status' => 'open',
            'priority' => 'high',
            'tags' => ['bug'],
            'assignee_id' => $agent->id,
            'reporter_id' => $agent->id,
        ]);

        // Create other tickets that don't match
        Ticket::factory()->create([
            'status' => 'closed',
            'priority' => 'high',
            'tags' => ['bug'],
            'reporter_id' => $agent->id,
        ]);

        $response = $this->getJson("/api/tickets?status=open&priority=high&tag=bug&assignee_id={$agent->id}");

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertNotEmpty($data);
        foreach ($data as $ticket) {
            $this->assertEquals('open', $ticket['status']);
            $this->assertEquals('high', $ticket['priority']);
            $this->assertContains('bug', $ticket['tags']);
            if ($ticket['assignee']) {
                $this->assertEquals($agent->id, $ticket['assignee']['id']);
            }
        }
    }

    public function test_list_returns_proper_structure()
    {
        $agent = User::where('email', 'agent@helpdesk.com')->first();
        Sanctum::actingAs($agent);

        $response = $this->getJson('/api/tickets');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id', 'title', 'priority', 'status',
                        'reporter' => ['id', 'name', 'role'],
                        'tags', 'created_at', 'updated_at'
                    ]
                ],
                'count'
            ]);
    }
}
