<?php

use App\Http\Controllers\Api\AuthController;
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
    Route::get('/tickets', [TicketController::class, 'index']);
});
