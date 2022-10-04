<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use GooGee\LaravelBuilder\Service\FileManager;

class Constant
{
    const VERSION = '0.1.1';

    const NAME = 'LaravelBuilder';
    const NAME2 = 'laravel-builder';
    const PATH = FileManager::DirectorySeparator . self::NAME2;

    static function getVersion()
    {
        $zz = explode('.', self::VERSION);
        return $zz[0] . str_pad($zz [1], 2, '0', 0);
    }
}
