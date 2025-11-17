<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->when(isset($this->description), $this->description),
            'priority' => $this->priority instanceof \BackedEnum ? $this->priority->value : (string) $this->priority,
            'status' => $this->status instanceof \BackedEnum ? $this->status->value : (string) $this->status,
            'reporter' => $this->whenLoaded('reporter', function () {
                return [
                    'id' => $this->reporter?->id,
                    'name' => $this->reporter?->name,
                    'role' => $this->reporter?->role?->name,
                ];
            }),
            'assignee' => $this->whenLoaded('assignee', function () {
                return $this->assignee ? [
                    'id' => $this->assignee->id,
                    'name' => $this->assignee->name,
                    'role' => $this->assignee->role?->name,
                ] : null;
            }),
            'tags' => $this->tags ?? [],
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
            'status_changes' => $this->whenLoaded('statusChanges', function () {
                return TicketStatusChangeResource::collection($this->statusChanges);
            }),
        ];
    }
}
