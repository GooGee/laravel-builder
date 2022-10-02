<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Service\RunCommand;
use Illuminate\Http\Request;

class RunMigrateController extends AbstractController
{
    public function __invoke(RunCommand $run, Request $request)
    {
        $step = $request->toArray()['step'];
        $versionzz = [
            -1 => 'migrate:rollback',
            0 => 'db:wipe',
        ];
        $command = 'migrate';
        if (isset($versionzz[$step])) {
            $command = $versionzz[$step];
        }
        [$error, $content] = $run($command);
        if ($error === 0) {
            return $this->ok($content);
        }
        return $this->no($content);
    }
}