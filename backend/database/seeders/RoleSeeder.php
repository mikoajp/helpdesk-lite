<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrator with full access',
            ],
            [
                'name' => 'agent',
                'description' => 'Support agent who can manage all tickets',
            ],
            [
                'name' => 'reporter',
                'description' => 'User who can create and view their own tickets',
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
