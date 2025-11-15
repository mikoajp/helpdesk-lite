<?php

namespace Tests\Unit;

use App\Models\Ticket;
use App\Models\User;
use App\Services\TriageService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TriageServiceTest extends TestCase
{
    use RefreshDatabase;

    private TriageService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
        $this->service = new TriageService();
    }

    public function test_suggest_triage_returns_required_fields()
    {
        $ticket = Ticket::first();

        $result = $this->service->suggestTriage($ticket);

        $this->assertArrayHasKey('ticket_id', $result);
        $this->assertArrayHasKey('suggested_priority', $result);
        $this->assertArrayHasKey('suggested_status', $result);
        $this->assertArrayHasKey('summary', $result);
        $this->assertArrayHasKey('confidence', $result);
        $this->assertArrayHasKey('method', $result);
    }

    public function test_suggest_triage_identifies_high_priority_from_urgent_keywords()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'System is down - URGENT',
            'description' => 'Critical error 500 on production. Cannot login.',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('high', $result['suggested_priority']);
    }

    public function test_suggest_triage_identifies_low_priority_from_feature_request()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Feature request for new UI',
            'description' => 'Nice to have: add dark mode to the application',
            'priority' => 'high',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('low', $result['suggested_priority']);
    }

    public function test_suggest_triage_identifies_high_priority_from_tags()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Issue with system',
            'description' => 'Some problem occurred',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => ['urgent', 'critical'],
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('high', $result['suggested_priority']);
    }

    public function test_suggest_triage_suggests_in_progress_when_assignee_set()
    {
        $user = User::first();
        $assignee = User::skip(1)->first();
        
        $ticket = Ticket::create([
            'title' => 'Bug to fix',
            'description' => 'Need to fix this bug',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
            'assignee_id' => $assignee->id,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('in_progress', $result['suggested_status']);
    }

    public function test_suggest_triage_calculates_confidence_score()
    {
        $ticket = Ticket::first();

        $result = $this->service->suggestTriage($ticket);

        $this->assertIsFloat($result['confidence']);
        $this->assertGreaterThanOrEqual(0, $result['confidence']);
        $this->assertLessThanOrEqual(1, $result['confidence']);
    }

    public function test_suggest_triage_returns_higher_confidence_with_more_data()
    {
        $user = User::first();
        
        // Ticket with minimal data
        $ticketMinimal = Ticket::create([
            'title' => 'Issue',
            'description' => 'Problem',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        // Ticket with rich data
        $ticketRich = Ticket::create([
            'title' => 'Detailed issue with system login',
            'description' => 'Users are experiencing issues when trying to login to the system. Error 500 appears after entering credentials.',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
            'assignee_id' => User::skip(1)->first()->id,
            'tags' => ['auth', 'bug', 'urgent'],
        ]);

        $resultMinimal = $this->service->suggestTriage($ticketMinimal);
        $resultRich = $this->service->suggestTriage($ticketRich);

        $this->assertGreaterThan($resultMinimal['confidence'], $resultRich['confidence']);
    }

    public function test_suggest_triage_generates_meaningful_summary()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Critical bug',
            'description' => 'System is down',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => ['urgent'],
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertNotEmpty($result['summary']);
        $this->assertIsString($result['summary']);
        $this->assertGreaterThan(10, strlen($result['summary']));
    }

    public function test_suggest_triage_uses_rules_method_by_default()
    {
        $ticket = Ticket::first();

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('rules', $result['method']);
    }

    public function test_suggest_triage_returns_valid_priority_values()
    {
        $ticket = Ticket::first();

        $result = $this->service->suggestTriage($ticket);

        $this->assertContains($result['suggested_priority'], ['low', 'medium', 'high']);
    }

    public function test_suggest_triage_returns_valid_status_values()
    {
        $ticket = Ticket::first();

        $result = $this->service->suggestTriage($ticket);

        $this->assertContains($result['suggested_status'], ['open', 'in_progress', 'resolved', 'closed']);
    }

    public function test_suggest_triage_handles_empty_tags()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Issue',
            'description' => 'Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => [],
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('suggested_priority', $result);
    }

    public function test_suggest_triage_handles_null_tags()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Issue',
            'description' => 'Description',
            'priority' => 'medium',
            'status' => 'open',
            'reporter_id' => $user->id,
            'tags' => null,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('suggested_priority', $result);
    }

    public function test_suggest_triage_detects_security_issues()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Security vulnerability found',
            'description' => 'There is a security issue that needs immediate attention',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('high', $result['suggested_priority']);
    }

    public function test_suggest_triage_detects_error_500()
    {
        $user = User::first();
        
        $ticket = Ticket::create([
            'title' => 'Getting error 500',
            'description' => 'The system returns error 500 when submitting the form',
            'priority' => 'low',
            'status' => 'open',
            'reporter_id' => $user->id,
        ]);

        $result = $this->service->suggestTriage($ticket);

        $this->assertEquals('high', $result['suggested_priority']);
    }
}
