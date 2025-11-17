<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ExternalUserController;
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
    
    // Triage assistant
    Route::post('/tickets/{id}/triage-suggest', [TicketController::class, 'triageSuggest']);
    
    // External data integration
    Route::get('/tickets/{id}/external-user', [ExternalUserController::class, 'show']);
});
