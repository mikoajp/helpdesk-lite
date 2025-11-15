<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        // Get existing role or create a default one
        $role = Role::firstOrCreate(['name' => 'reporter']);

        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'status' => fake()->randomElement(['open', 'in_progress', 'resolved', 'closed']),
            'reporter_id' => User::factory()->create(['role_id' => $role->id])->id,
            'assignee_id' => fake()->boolean(70) ? User::factory()->create(['role_id' => $role->id])->id : null,
            'tags' => fake()->randomElements(['bug', 'feature', 'enhancement', 'urgent', 'documentation'], fake()->numberBetween(0, 3)),
        ];
    }
}
