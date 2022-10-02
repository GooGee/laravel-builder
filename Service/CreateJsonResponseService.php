<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

use Illuminate\Http\JsonResponse;

class CreateJsonResponseService
{
    static function ok($data = null, string $message = 'OK', array $headerzz = [])
    {
        return self::no($message, $data, 200, $headerzz);
    }

    static function no(string $message, $data = null, int $status = 400, array $headerzz = [])
    {
        return self::run(compact('status', 'message', 'data'), $status, $headerzz);
    }

    static function run(array $data = [], int $status = 200, array $headerzz = [])
    {
        return new JsonResponse($data, $status, $headerzz);
    }
}