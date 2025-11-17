<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\TicketStatus;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Models\Ticket;
use App\Services\TriageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    private TriageService $triageService;

    public function __construct(TriageService $triageService)
    {
        $this->triageService = $triageService;
    }
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

    public function show(int $id)
    {
        $ticket = Ticket::query()
            ->with(['reporter.role', 'assignee.role', 'statusChanges.user'])
            ->findOrFail($id);

        $this->authorize('view', $ticket);

        return response()->json([
            'id' => $ticket->id,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'priority' => $ticket->priority,
            'status' => $ticket->status,
            'reporter' => [
                'id' => $ticket->reporter?->id,
                'name' => $ticket->reporter?->name,
                'role' => $ticket->reporter?->role?->name,
            ],
            'assignee' => $ticket->assignee ? [
                'id' => $ticket->assignee->id,
                'name' => $ticket->assignee->name,
                'role' => $ticket->assignee->role?->name,
            ] : null,
            'tags' => $ticket->tags ?? [],
            'created_at' => $ticket->created_at?->toIso8601String(),
            'updated_at' => $ticket->updated_at?->toIso8601String(),
            'status_changes' => $ticket->statusChanges->map(function ($change) {
                return [
                    'id' => $change->id,
                    'old_status' => $change->old_status,
                    'new_status' => $change->new_status,
                    'comment' => $change->comment,
                    'user' => [
                        'id' => $change->user?->id,
                        'name' => $change->user?->name,
                    ],
                    'created_at' => $change->created_at?->toIso8601String(),
                ];
            }),
        ]);
    }

    public function store(StoreTicketRequest $request)
    {
        $validated = $request->validated();

        $user = Auth::user();
        
        $ticket = Ticket::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'status' => TicketStatus::OPEN,
            'reporter_id' => $user->id,
            'assignee_id' => $validated['assignee_id'] ?? null,
            'tags' => $validated['tags'] ?? [],
        ]);

        $ticket->load(['reporter.role', 'assignee.role']);

        return response()->json([
            'id' => $ticket->id,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'priority' => $ticket->priority,
            'status' => $ticket->status,
            'reporter' => [
                'id' => $ticket->reporter?->id,
                'name' => $ticket->reporter?->name,
                'role' => $ticket->reporter?->role?->name,
            ],
            'assignee' => $ticket->assignee ? [
                'id' => $ticket->assignee->id,
                'name' => $ticket->assignee->name,
                'role' => $ticket->assignee->role?->name,
            ] : null,
            'tags' => $ticket->tags ?? [],
            'created_at' => $ticket->created_at?->toIso8601String(),
            'updated_at' => $ticket->updated_at?->toIso8601String(),
        ], 201);
    }

    public function update(UpdateTicketRequest $request, int $id)
    {
        $validated = $request->validated();

        $ticket = Ticket::findOrFail($id);

        $this->authorize('update', $ticket);

        $ticket->update($validated);
        $ticket->load(['reporter.role', 'assignee.role']);

        return response()->json([
            'id' => $ticket->id,
            'title' => $ticket->title,
            'description' => $ticket->description,
            'priority' => $ticket->priority,
            'status' => $ticket->status,
            'reporter' => [
                'id' => $ticket->reporter?->id,
                'name' => $ticket->reporter?->name,
                'role' => $ticket->reporter?->role?->name,
            ],
            'assignee' => $ticket->assignee ? [
                'id' => $ticket->assignee->id,
                'name' => $ticket->assignee->name,
                'role' => $ticket->assignee->role?->name,
            ] : null,
            'tags' => $ticket->tags ?? [],
            'created_at' => $ticket->created_at?->toIso8601String(),
            'updated_at' => $ticket->updated_at?->toIso8601String(),
        ]);
    }

    public function destroy(int $id)
    {
        $ticket = Ticket::findOrFail($id);

        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json(null, 204);
    }

    public function statusChanges(int $id)
    {
        $ticket = Ticket::query()
            ->with(['statusChanges.user'])
            ->findOrFail($id);

        $this->authorize('view', $ticket);

        return response()->json([
            'data' => $ticket->statusChanges->map(function ($change) {
                return [
                    'id' => $change->id,
                    'old_status' => $change->old_status,
                    'new_status' => $change->new_status,
                    'comment' => $change->comment,
                    'user' => [
                        'id' => $change->user?->id,
                        'name' => $change->user?->name,
                    ],
                    'created_at' => $change->created_at?->toIso8601String(),
                ];
            }),
        ]);
    }

    public function triageSuggest(int $id)
    {
        $ticket = Ticket::query()
            ->with(['reporter.role', 'assignee.role'])
            ->findOrFail($id);

        $this->authorize('view', $ticket);

        try {
            $suggestion = $this->triageService->suggestTriage($ticket);
            
            return response()->json($suggestion);
        } catch (\Exception $e) {
            return response()->json([
                'error' => [
                    'code' => 'triage_failed',
                    'message' => 'Failed to generate triage suggestion',
                    'details' => $e->getMessage(),
                ],
            ], 500);
        }
    }
}
