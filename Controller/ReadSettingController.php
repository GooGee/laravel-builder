<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Constant;
use GooGee\LaravelBuilder\Controller\AbstractController;
use GooGee\LaravelBuilder\Service\SettingFileService;

class ReadSettingController extends AbstractController
{
    public function __invoke(SettingFileService $service)
    {
        $version = Constant::VERSION;
        $packageName = 'googee/laravel-builder';
        $data = $service->read();
        return $this->ok(compact('version', 'packageName', 'data'));
    }
}
