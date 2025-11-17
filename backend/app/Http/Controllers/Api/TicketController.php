<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\TicketStatus;
use App\Http\Requests\Ticket\StoreTicketRequest;
use App\Http\Requests\Ticket\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use App\Http\Resources\TicketStatusChangeResource;
use App\Models\Ticket;
use App\Contracts\TriageServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    private TriageServiceInterface $triageService;

    public function __construct(TriageServiceInterface $triageService)
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

        $tickets = $query->limit(50)->get();

        return TicketResource::collection($tickets)
            ->additional(['count' => $tickets->count()]);
    }

    public function show(int $id)
    {
        $ticket = Ticket::query()
            ->with(['reporter.role', 'assignee.role', 'statusChanges.user'])
            ->findOrFail($id);

        $this->authorize('view', $ticket);

        return new TicketResource($ticket->loadMissing(['reporter.role', 'assignee.role', 'statusChanges.user']));
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

        return (new TicketResource($ticket->loadMissing(['reporter.role', 'assignee.role'])))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTicketRequest $request, int $id)
    {
        $validated = $request->validated();

        $ticket = Ticket::findOrFail($id);

        $this->authorize('update', $ticket);

        $ticket->update($validated);
        $ticket->load(['reporter.role', 'assignee.role']);

        return new TicketResource($ticket->loadMissing(['reporter.role', 'assignee.role']));
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

        return TicketStatusChangeResource::collection($ticket->statusChanges->load('user'));
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
