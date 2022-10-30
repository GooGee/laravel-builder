<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Constant;
use GooGee\LaravelBuilder\Service\FileManager;
use GooGee\LaravelBuilder\Service\SettingFileService;

class ReadSettingController extends AbstractController
{
    public function __invoke(SettingFileService $service, FileManager $fileManager)
    {
        $version = Constant::VERSION;
        $data = $service->read();
        $composer = $fileManager->read('composer.json');
        return $this->ok(compact('version', 'data', 'composer'));
    }
}
