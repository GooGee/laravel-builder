<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Controller;

use GooGee\LaravelBuilder\Doctrine\Migration\ReadDBSchema;

class ReadDBSchemaController extends AbstractController
{
    public function __invoke(ReadDBSchema $readDBSchema)
    {
        return $this->ok($readDBSchema->run());
    }

}