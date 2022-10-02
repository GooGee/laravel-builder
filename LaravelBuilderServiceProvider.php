<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use GooGee\LaravelBuilder\Service\FileManager;
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
            __DIR__ . '/build' . Constant::getVersion() => base_path(FileManager::getHtmlDirectory()),
            __DIR__ . '/code' => base_path(Constant::NAME2 . '/code'),
        ]);

        if ($this->app->runningInConsole()) {
            $this->commands([
                SetupCommand::class,
            ]);
        }
    }

}