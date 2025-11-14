<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'reporter_id',
        'assignee_id',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::created(function (Ticket $ticket) {
            $ticket->statusChanges()->create([
                'user_id' => auth()->id() ?? $ticket->reporter_id,
                'old_status' => null,
                'new_status' => $ticket->status,
            ]);
        });

        static::updated(function (Ticket $ticket) {
            if ($ticket->wasChanged('status')) {
                $ticket->statusChanges()->create([
                    'user_id' => auth()->id() ?? $ticket->reporter_id,
                    'old_status' => $ticket->getOriginal('status'),
                    'new_status' => $ticket->status,
                ]);
            }
        });
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assignee_id');
    }

    public function statusChanges(): HasMany
    {
        return $this->hasMany(TicketStatusChange::class)->orderBy('created_at', 'desc');
    }

    // Query scopes for filtering
    public function scopeByStatus($query, ?string $status)
    {
        if ($status) {
            return $query->where('status', $status);
        }
        return $query;
    }

    public function scopeByPriority($query, ?string $priority)
    {
        if ($priority) {
            return $query->where('priority', $priority);
        }
        return $query;
    }

    public function scopeByAssignee($query, ?int $assigneeId)
    {
        if ($assigneeId) {
            return $query->where('assignee_id', $assigneeId);
        }
        return $query;
    }

    public function scopeByTag($query, ?string $tag)
    {
        if ($tag) {
            return $query->whereJsonContains('tags', $tag);
        }
        return $query;
    }

    public function scopeForUser($query, User $user)
    {
        // Reporters see only their tickets, agents and admins see all
        if ($user->role->isReporter()) {
            return $query->where('reporter_id', $user->id);
        }
        return $query;
    }
}
