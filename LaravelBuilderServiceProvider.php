<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use Illuminate\Support\ServiceProvider;
use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;

class LaravelBuilderServiceProvider extends ServiceProvider
{
    public function register()
    {
        if (app()->isLocal()) {
            $this->loadRoutesFrom(__DIR__ . '/route.php');

            $this->app->singleton(Filesystem::class, function () {
                $adapter = new LocalFilesystemAdapter(base_path());
                return new Filesystem($adapter);
            });
        }
    }

    public function boot()
    {
        $this->publishes([
            __DIR__ . '/laravelbuilder.php' => config_path('laravelbuilder.php'),
            __DIR__ . '/code' => base_path(Constant::NAME2 . '/code' . Constant::getVersion()),
        ]);

        if ($this->app->runningInConsole()) {
            $this->commands([
                SetupCommand::class,
            ]);
        }
    }

}
