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
            'base' => ['sometimes', 'string', 'size:3', 'alpha'],
            'symbols' => ['sometimes', 'string', 'regex:/^([A-Z]{3})(,[A-Z]{3})*$/i'] // comma-separated 3-letter codes
        ];
    }
}
