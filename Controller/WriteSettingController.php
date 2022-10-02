<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Controller\AbstractController;
use GooGee\LaravelBuilder\Service\SettingFileService;
use Illuminate\Http\Request;

class WriteSettingController extends AbstractController
{
    public function __invoke(Request $request, SettingFileService $service)
    {
        $data = $request->toArray();
        if ($data['backup']) {
            $service->makeBackup();
        }
        $service->write($data['content']);
        return $this->ok();
    }
}