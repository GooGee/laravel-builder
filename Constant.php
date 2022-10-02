<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use GooGee\LaravelBuilder\Service\FileManager;

class Constant
{
    const VERSION = '0.1.0';

    const NAME = 'LaravelBuilder';
    const NAME2 = 'laravel-builder';
    const PATH = FileManager::DirectorySeparator . self::NAME2;
}
