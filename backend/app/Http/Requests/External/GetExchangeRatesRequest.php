<?php

namespace App\Http\Requests\External;

use Illuminate\Foundation\Http\FormRequest;

class GetExchangeRatesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // policy can be added if needed
    }

    public function rules(): array
    {
        return [
            'base' => ['sometimes', 'string', 'size:3'],
            'symbols' => ['sometimes', 'string'], // comma-separated list, validated lightly
        ];
    }
}
