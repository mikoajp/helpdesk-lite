<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function reportedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'reporter_id');
    }

    public function assignedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'assignee_id');
    }

    public function statusChanges(): HasMany
    {
        return $this->hasMany(TicketStatusChange::class);
    }

    // Helper methods for role checking
    public function isAdmin(): bool
    {
        return $this->role->name === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->role->name === 'agent';
    }

    public function isReporter(): bool
    {
        return $this->role->name === 'reporter';
    }

    public function canViewTicket(Ticket $ticket): bool
    {
        // Admins and agents can view all tickets
        if ($this->isAdmin() || $this->isAgent()) {
            return true;
        }
        
        // Reporters can only view their own tickets
        return $ticket->reporter_id === $this->id;
    }

    public function canModifyTicket(Ticket $ticket): bool
    {
        // Admins can modify all tickets
        if ($this->isAdmin()) {
            return true;
        }
        
        // Agents can modify tickets assigned to them or unassigned tickets
        if ($this->isAgent()) {
            return true;
        }
        
        // Reporters can only modify their own tickets
        return $ticket->reporter_id === $this->id;
    }
}
