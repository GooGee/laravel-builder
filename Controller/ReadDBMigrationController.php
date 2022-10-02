<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Service\MigrationService;

class ReadDBMigrationController extends AbstractController
{
    public function __invoke(MigrationService $service)
    {
        $data = [
            'dbexist' => true,
            'filezz' => $service->getAllFile(),
            'migrationzz' => [],
        ];
        try {
            $data['migrationzz'] = $service->getAllInDB();
            return $this->ok($data);
        } catch (\Exception $exception) {
            $data['dbexist'] = false;
            return $this->no($exception->getMessage(), $data);
        }
    }
}