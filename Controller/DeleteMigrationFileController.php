<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Controller\AbstractController;
use GooGee\LaravelBuilder\Service\MigrationService;
use Illuminate\Http\Request;

class DeleteMigrationFileController extends AbstractController
{
    public function __invoke(Request $request, MigrationService $service)
    {
        $service->delete($request->toArray()['file']);
        return $this->ok();
    }
}