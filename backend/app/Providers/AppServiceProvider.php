<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Contracts\TriageServiceInterface::class, \App\Services\TriageService::class);
        $this->app->bind(\App\Contracts\ExchangeRateServiceInterface::class, \App\Services\ExchangeRateService::class);
        $this->app->bind(\App\Contracts\TicketRepositoryInterface::class, \App\Repositories\EloquentTicketRepository::class);
        $this->app->bind(\App\Contracts\TicketStatusChangeRepositoryInterface::class, \App\Repositories\EloquentTicketStatusChangeRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // keep default resource wrapping for tests
    }
}
