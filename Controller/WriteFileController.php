<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Service\FileManager;
use Illuminate\Http\Request;

class WriteFileController extends AbstractController
{
    public function __invoke(Request $request, FileManager $service)
    {
        $data = $request->toArray();
        $service->write($data['file'], $data['content']);
        return $this->ok($data['file']);
    }
}