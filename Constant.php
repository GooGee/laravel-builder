<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

class Constant
{
    const VERSION = '0.6.0';

    const NAME = 'LaravelBuilder';
    const NAME2 = 'laravel-builder';

    static function getVersion()
    {
        $zz = explode('.', self::VERSION);
        return $zz[0] . str_pad($zz [1], 2, '0', 0);
    }
}
