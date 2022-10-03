<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Doctrine\Migration;

use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\Migrations\DependencyFactory;

class ReadDBSchema
{
    private AbstractSchemaManager $schemaManager;

    public function __construct(private DependencyFactory $dependencyFactory)
    {
        $this->schemaManager = $dependencyFactory->getConnection()->createSchemaManager();
    }

    function run()
    {
        return $this->schemaManager->createSchema();
    }
}