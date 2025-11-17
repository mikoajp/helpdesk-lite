<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $reporter = User::whereHas('role', function ($query) {
            $query->where('name', 'reporter');
        })->first();

        $agent = User::whereHas('role', function ($query) {
            $query->where('name', 'agent');
        })->first();

        $admin = User::whereHas('role', function ($query) {
            $query->where('name', 'admin');
        })->first();

        $tickets = [
            // Reporter's tickets
            [
                'title' => 'Cannot login to the system',
                'description' => 'I am getting error 500 when trying to login. This started happening this morning.',
                'priority' => 'high',
                'status' => 'open',
                'reporter_id' => $reporter->id,
                'assignee_id' => null,
                'tags' => ['auth', 'urgent', 'bug'],
            ],
            [
                'title' => 'Feature request: Dark mode',
                'description' => 'It would be great to have a dark mode option for the application.',
                'priority' => 'low',
                'status' => 'open',
                'reporter_id' => $reporter->id,
                'assignee_id' => $agent->id,
                'tags' => ['feature', 'ui'],
            ],
            [
                'title' => 'Email notifications not working',
                'description' => 'I am not receiving email notifications for ticket updates.',
                'priority' => 'medium',
                'status' => 'in_progress',
                'reporter_id' => $reporter->id,
                'assignee_id' => $agent->id,
                'tags' => ['email', 'notifications', 'bug'],
            ],
            [
                'title' => 'Performance issue on dashboard',
                'description' => 'The dashboard is loading very slowly, taking more than 10 seconds to display.',
                'priority' => 'high',
                'status' => 'in_progress',
                'reporter_id' => $reporter->id,
                'assignee_id' => $agent->id,
                'tags' => ['performance', 'dashboard'],
            ],
            [
                'title' => 'Documentation update needed',
                'description' => 'The API documentation is outdated and needs to be updated with the latest endpoints.',
                'priority' => 'low',
                'status' => 'resolved',
                'reporter_id' => $reporter->id,
                'assignee_id' => $agent->id,
                'tags' => ['documentation'],
            ],
            // Agent's tickets (so reporter cannot see them)
            [
                'title' => 'Agent reported bug in export feature',
                'description' => 'Export to CSV is not working properly for large datasets.',
                'priority' => 'medium',
                'status' => 'open',
                'reporter_id' => $agent->id,
                'assignee_id' => $admin->id,
                'tags' => ['bug', 'export'],
            ],
            // Admin's tickets (so reporter cannot see them)
            [
                'title' => 'Server maintenance needed',
                'description' => 'We need to schedule server maintenance for next week.',
                'priority' => 'high',
                'status' => 'open',
                'reporter_id' => $admin->id,
                'assignee_id' => $agent->id,
                'tags' => ['maintenance', 'infrastructure'],
            ],
        ];

        foreach ($tickets as $ticketData) {
            Ticket::create($ticketData);
        }
    }
}
