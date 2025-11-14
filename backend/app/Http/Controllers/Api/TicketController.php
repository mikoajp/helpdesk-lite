<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Ticket::query()
            ->with(['reporter.role', 'assignee.role'])
            ->forUser($user)
            ->byStatus($request->query('status'))
            ->byPriority($request->query('priority'))
            ->byAssignee($request->query('assignee_id'))
            ->byTag($request->query('tag'))
            ->orderByDesc('created_at');

        $tickets = $query->limit(50)->get()->map(function (Ticket $t) {
            return [
                'id' => $t->id,
                'title' => $t->title,
                'priority' => $t->priority,
                'status' => $t->status,
                'reporter' => [
                    'id' => $t->reporter?->id,
                    'name' => $t->reporter?->name,
                    'role' => $t->reporter?->role?->name,
                ],
                'assignee' => $t->assignee ? [
                    'id' => $t->assignee->id,
                    'name' => $t->assignee->name,
                    'role' => $t->assignee->role?->name,
                ] : null,
                'tags' => $t->tags ?? [],
                'created_at' => $t->created_at?->toIso8601String(),
                'updated_at' => $t->updated_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'data' => $tickets,
            'count' => $tickets->count(),
        ]);
    }
}
