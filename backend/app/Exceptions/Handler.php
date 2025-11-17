<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            // default reporting
        });

        $this->renderable(function (TriageFailedException $e, $request) {
            \Log::error('Triage failed', $e->context);
            return response()->json([
                'error' => [
                    'code' => 'triage_failed',
                    'message' => $e->getMessage(),
                    'details' => $e->getPrevious()?->getMessage(),
                ],
            ], 503);
        });

        $this->renderable(function (ExchangeRateUnavailableException $e, $request) {
            \Log::error('Exchange rates unavailable', $e->context);
            return response()->json([
                'error' => [
                    'code' => 'exchange_rate_unavailable',
                    'message' => $e->getMessage(),
                    'details' => $e->getPrevious()?->getMessage(),
                ],
            ], 503);
        });
    }
}
