<?php

namespace App\Http\Requests\Ticket;

use App\Enums\TicketPriority;
use App\Enums\TicketStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes','string','max:255'],
            'description' => ['sometimes','string'],
            'priority' => ['sometimes', Rule::enum(TicketPriority::class)],
            'status' => ['sometimes', Rule::enum(TicketStatus::class)],
            'assignee_id' => ['nullable','exists:users,id'],
            'tags' => ['nullable','array'],
            'tags.*' => ['string','max:50'],
        ];
    }
}
