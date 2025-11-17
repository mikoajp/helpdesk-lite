<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ExternalUserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_external_user_endpoint_success()
    {
        $ticket = Ticket::first();
        $user = User::first();
        Sanctum::actingAs($user);

        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;

        Http::fake([
            'jsonplaceholder.typicode.com/users/' . $placeholderId => Http::response([
                'id' => $placeholderId,
                'name' => 'Leanne Graham',
                'username' => 'Bret',
                'email' => 'leanne@example.com',
                'company' => ['name' => 'Romaguera-Crona'],
            ], 200),
        ]);

        $response = $this->getJson('/api/tickets/' . $ticket->id . '/external-user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success', 'ticket_id', 'user' => ['id','name','username','email','company','source']
            ])
            ->assertJson([
                'success' => true,
                'ticket_id' => $ticket->id,
                'user' => [
                    'id' => $placeholderId,
                    'source' => 'jsonplaceholder',
                ]
            ]);

        Http::assertSentCount(1);
    }

    public function test_external_user_endpoint_failure()
    {
        $ticket = Ticket::first();
        $user = User::first();
        Sanctum::actingAs($user);

        $placeholderId = (($ticket->reporter_id - 1) % 10) + 1;

        Http::fake([
            'jsonplaceholder.typicode.com/users/' . $placeholderId => Http::response([], 500),
        ]);

        $response = $this->getJson('/api/tickets/' . $ticket->id . '/external-user');

        $response->assertStatus(503)
            ->assertJsonStructure(['success','ticket_id','error' => ['code','message','details']])
            ->assertJson([
                'success' => false,
                'ticket_id' => $ticket->id,
            ]);

        Http::assertSentCount(1);
    }
}