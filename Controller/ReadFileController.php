<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Service\FileManager;
use Illuminate\Http\Request;

class ReadFileController extends AbstractController
{
    public function __invoke(Request $request, FileManager $fileManager)
    {
        return $this->ok($fileManager->readAll($request->input('folder')));
    }
}
