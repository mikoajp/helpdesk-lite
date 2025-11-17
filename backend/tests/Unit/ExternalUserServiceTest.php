<?php

namespace Tests\Unit;

use App\Models\Ticket;
use App\Services\ExternalUserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ExternalUserServiceTest extends TestCase
{
    use RefreshDatabase;

    private ExternalUserService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
        $this->service = app(ExternalUserService::class);
    }

    public function test_get_user_for_ticket_success()
    {
        $ticket = \App\Models\Ticket::first();
        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;

        Http::fake([
            'jsonplaceholder.typicode.com/users/' . $placeholderId => Http::response([
                'id' => $placeholderId,
                'name' => 'Test User',
                'username' => 'testuser',
                'email' => 'test@example.com',
                'company' => ['name' => 'TestCo']
            ], 200)
        ]);

        $result = $this->service->getUserForTicket($ticket);

        $this->assertTrue($result['success']);
        $this->assertEquals($ticket->id, $result['ticket_id']);
        $this->assertEquals($placeholderId, $result['user']['id']);
        $this->assertEquals('jsonplaceholder', $result['user']['source']);
        Http::assertSentCount(1);
    }

    public function test_get_user_for_ticket_failure()
    {
        $ticket = \App\Models\Ticket::first();
        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;

        Http::fake([
            'jsonplaceholder.typicode.com/users/' . $placeholderId => Http::response([], 500)
        ]);

        $result = $this->service->getUserForTicket($ticket);

        $this->assertFalse($result['success']);
        $this->assertEquals($ticket->id, $result['ticket_id']);
        $this->assertArrayHasKey('error', $result);
        Http::assertSentCount(1);
    }
}