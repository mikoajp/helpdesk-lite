<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExternalDataController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\TicketController;
use Illuminate\Support\Facades\Route;

// Health check endpoint
Route::get('/ping', [HealthController::class, 'ping']);

// Authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Tickets CRUD
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('/tickets/{id}', [TicketController::class, 'show']);
    Route::post('/tickets', [TicketController::class, 'store']);
    Route::put('/tickets/{id}', [TicketController::class, 'update']);
    Route::delete('/tickets/{id}', [TicketController::class, 'destroy']);
    
    // Ticket status changes history
    Route::get('/tickets/{id}/status-changes', [TicketController::class, 'statusChanges']);
    
    // External data integration
    Route::get('/external-data', [ExternalDataController::class, 'getExchangeRates']);
});
