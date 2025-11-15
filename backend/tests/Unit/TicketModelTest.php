<?php

namespace Tests\Unit;

use App\Models\Ticket;
use App\Models\TicketStatusChange;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketModelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_ticket_creation_automatically_records_status_change()
    {
        $user = User::first();

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => ['test'],
        ]);

        $this->assertDatabaseHas('ticket_status_changes', [
            'ticket_id' => $ticket->id,
            'old_status' => null,
            'new_status' => 'open',
        ]);

        $statusChanges = TicketStatusChange::where('ticket_id', $ticket->id)->get();
        $this->assertCount(1, $statusChanges);
    }

    public function test_ticket_status_update_records_status_change()
    {
        $user = User::first();
        $this->actingAs($user);

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        // Update status
        $ticket->update(['status' => 'in_progress']);

        $this->assertDatabaseHas('ticket_status_changes', [
            'ticket_id' => $ticket->id,
            'old_status' => 'open',
            'new_status' => 'in_progress',
            'user_id' => $user->id,
        ]);

        $statusChanges = TicketStatusChange::where('ticket_id', $ticket->id)->get();
        $this->assertCount(2, $statusChanges); // Initial + update
    }

    public function test_ticket_update_without_status_change_does_not_record()
    {
        $user = User::first();
        $this->actingAs($user);

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $initialCount = TicketStatusChange::where('ticket_id', $ticket->id)->count();

        // Update title only, not status
        $ticket->update(['title' => 'Updated Title']);

        $finalCount = TicketStatusChange::where('ticket_id', $ticket->id)->count();
        $this->assertEquals($initialCount, $finalCount);
    }

    public function test_tags_are_cast_to_array()
    {
        $user = User::first();

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => ['bug', 'urgent', 'frontend'],
        ]);

        $ticket->refresh();
        
        $this->assertIsArray($ticket->tags);
        $this->assertEquals(['bug', 'urgent', 'frontend'], $ticket->tags);
    }

    public function test_ticket_has_reporter_relationship()
    {
        $user = User::first();

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $this->assertNotNull($ticket->reporter);
        $this->assertEquals($user->id, $ticket->reporter->id);
        $this->assertInstanceOf(User::class, $ticket->reporter);
    }

    public function test_ticket_has_assignee_relationship()
    {
        $reporter = User::first();
        $assignee = User::skip(1)->first();

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $reporter->id,
            'assignee_id' => $assignee->id,
        ]);

        $this->assertNotNull($ticket->assignee);
        $this->assertEquals($assignee->id, $ticket->assignee->id);
        $this->assertInstanceOf(User::class, $ticket->assignee);
    }

    public function test_ticket_has_status_changes_relationship()
    {
        $user = User::first();

        $ticket = Ticket::create([
            'title' => 'Test Ticket',
            'description' => 'Test Description',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $ticket->statusChanges);
        $this->assertGreaterThan(0, $ticket->statusChanges->count());
    }

    public function test_scope_by_status_filters_correctly()
    {
        $user = User::first();

        Ticket::create([
            'title' => 'Open Ticket',
            'description' => 'Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        Ticket::create([
            'title' => 'Closed Ticket',
            'description' => 'Description',
            'priority' => 'medium',
            'status' => 'closed',
            'reporter_id' => $user->id,
        ]);

        $openTickets = Ticket::byStatus('open')->get();
        
        foreach ($openTickets as $ticket) {
            $this->assertEquals('open', $ticket->status);
        }
    }

    public function test_scope_by_priority_filters_correctly()
    {
        $user = User::first();

        Ticket::create([
            'title' => 'High Priority',
            'description' => 'Description',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        Ticket::create([
            'title' => 'Low Priority',
            'description' => 'Description',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $highPriorityTickets = Ticket::byPriority('high')->get();
        
        foreach ($highPriorityTickets as $ticket) {
            $this->assertEquals('high', $ticket->priority);
        }
    }

    public function test_scope_for_user_filters_by_role()
    {
        $reporter = User::whereHas('role', function ($q) {
            $q->where('name', 'reporter');
        })->first();

        $agent = User::whereHas('role', function ($q) {
            $q->where('name', 'agent');
        })->first();

        // Create tickets for different reporters
        Ticket::create([
            'title' => 'Reporter 1 Ticket',
            'description' => 'Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $reporter->id,
        ]);

        if ($agent) {
            Ticket::create([
                'title' => 'Other Ticket',
                'description' => 'Description',
                'priority' => 'medium',
                'status' => 'open',
                'reporter_id' => $agent->id,
            ]);
        }

        // Reporter should only see their tickets
        $reporterTickets = Ticket::forUser($reporter)->get();
        foreach ($reporterTickets as $ticket) {
            $this->assertEquals($reporter->id, $ticket->reporter_id);
        }

        // Agent should see all tickets
        if ($agent) {
            $agentTickets = Ticket::forUser($agent)->get();
            $this->assertGreaterThanOrEqual(2, $agentTickets->count());
        }
    }
}
