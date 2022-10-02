<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

use Illuminate\Support\Facades\Artisan;
use Symfony\Component\Console\Output\BufferedOutput;

class RunCommand
{
    public function __invoke(string $command, $parameters = [])
    {
        $output = new BufferedOutput();
        $exitCode = Artisan::call($command, $parameters, $output);
        $content = $output->fetch();
        return [$exitCode, $content];
    }

}