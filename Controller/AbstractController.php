<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Service\CreateJsonResponseService;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

abstract class AbstractController extends Controller
{
    public function __construct()
    {
        if (app()->isLocal()) {
            return;
        }
        throw new \Error('LaravelBuilder is only available in local environment.');
    }

    protected function ok($data = null, string $message = 'OK', array $headerzz = [])
    {
        return CreateJsonResponseService::no($message, $data, 200, $headerzz);
    }

    protected function no(string $message, $data = null, int $status = 400, array $headerzz = [])
    {
        return CreateJsonResponseService::no($message, $data, $status, $headerzz);
    }

    protected function send(array $data, int $status, array $headerzz)
    {
        return CreateJsonResponseService::run($data, $status, $headerzz);
    }
}