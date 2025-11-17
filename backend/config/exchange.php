<?php

return [
    'default_base' => 'USD',
    'default_symbols' => 'EUR,PLN',

    // In local/dev, serve static fallback when external API unavailable
    'use_static_fallback' => env('EXCHANGE_USE_STATIC_FALLBACK', true),

    // Static fallback rates (used only when use_static_fallback=true and no cache)
    'static_fallback' => [
        'base' => 'USD',
        'rates' => [
            'EUR' => 0.92,
            'PLN' => 4.10,
        ],
    ],
];
