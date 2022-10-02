<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use Illuminate\Support\ServiceProvider;

class LaravelBuilderServiceProvider extends ServiceProvider
{
    public function register()
    {
        if (app()->isLocal()) {
            $this->loadRoutesFrom(__DIR__ . '/route.php');
        }
    }

    public function boot()
    {
        $this->publishes([
            __DIR__ . '/laravelbuilder.php' => config_path('laravelbuilder.php'),
            __DIR__ . '/DoctrineMigration.stub' => resource_path('vendor/DoctrineMigration.stub'),
        ]);
    }

}