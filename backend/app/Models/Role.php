<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // Helper methods for role checking
    public function isAdmin(): bool
    {
        return $this->name === 'admin';
    }

    public function isAgent(): bool
    {
        return $this->name === 'agent';
    }

    public function isReporter(): bool
    {
        return $this->name === 'reporter';
    }
}
