<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use Doctrine\Migrations\Generator\Exception\NoChangesDetected;
use GooGee\LaravelBuilder\Controller\AbstractController;
use GooGee\LaravelBuilder\Doctrine\Migration\CreateMigrationService;

class CreateMigrationFileController extends AbstractController
{
    public function __invoke(CreateMigrationService $service)
    {
        try {
            $file = $service->run();
            return $this->ok($file);
        } catch (NoChangesDetected $exception) {
            return $this->ok($exception->getMessage());
        } catch (\Exception $exception) {
            return $this->no($exception->getMessage());
        }
    }
}
