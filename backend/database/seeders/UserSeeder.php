<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::where('name', 'admin')->first();
        $agentRole = Role::where('name', 'agent')->first();
        $reporterRole = Role::where('name', 'reporter')->first();

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@helpdesk.com',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
        ]);

        // Create agent user
        User::create([
            'name' => 'Agent User',
            'email' => 'agent@helpdesk.com',
            'password' => Hash::make('password'),
            'role_id' => $agentRole->id,
        ]);

        // Create reporter user
        User::create([
            'name' => 'Reporter User',
            'email' => 'reporter@helpdesk.com',
            'password' => Hash::make('password'),
            'role_id' => $reporterRole->id,
        ]);
    }
}
