<?php

namespace App\Models;

use App\Enums\RoleName;
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
        return $this->name === RoleName::ADMIN->value;
    }

    public function isAgent(): bool
    {
        return $this->name === RoleName::AGENT->value;
    }

    public function isReporter(): bool
    {
        return $this->name === RoleName::REPORTER->value;
    }
}
