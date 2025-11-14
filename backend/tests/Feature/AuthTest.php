<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate');
        $this->seed();
    }

    public function test_login_returns_token_and_user()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'admin@helpdesk.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user' => ['id','name','email','role']]);
    }

    public function test_me_endpoint_returns_user_data()
    {
        $user = User::where('email', 'admin@helpdesk.com')->first();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->getJson('/api/auth/me', [
            'Authorization' => 'Bearer '.$token,
        ]);

        $response->assertStatus(200)->assertJsonFragment(['email' => 'admin@helpdesk.com']);
    }
}
