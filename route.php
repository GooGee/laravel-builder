<?php

Route::prefix('laravel-builder')->group(function () {

    Route::get('/', \GooGee\LaravelBuilder\Controller\ReadSettingController::class);
    Route::put('/', \GooGee\LaravelBuilder\Controller\WriteSettingController::class);

    Route::get('/dbmigration', \GooGee\LaravelBuilder\Controller\ReadDBMigrationController::class);

    Route::get('/file', \GooGee\LaravelBuilder\Controller\ReadFileController::class);
    Route::put('/file', \GooGee\LaravelBuilder\Controller\WriteFileController::class);

    Route::post('/migration', \GooGee\LaravelBuilder\Controller\RunMigrateController::class);

    Route::delete('/migration/file', \GooGee\LaravelBuilder\Controller\DeleteMigrationFileController::class);
    Route::post('/migration/file', \GooGee\LaravelBuilder\Controller\CreateMigrationFileController::class);

});
