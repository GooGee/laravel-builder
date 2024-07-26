<?php

namespace GooGee\LaravelBuilder\Doctrine\Migration;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Generator\Exception\NoChangesDetected;
use Doctrine\Migrations\Provider\OrmSchemaProvider;

class CreateMigrationService
{
    public function __construct(private DependencyFactory $dependencyFactory)
    {
    }

    private function createToSchema(): Schema
    {
        $schemaProvider = new OrmSchemaProvider($this->dependencyFactory->getEntityManager());
        $toSchema = $schemaProvider->createSchema();

        $schemaAssetsFilter = $this->dependencyFactory->getConnection()->getConfiguration()->getSchemaAssetsFilter();

        foreach ($toSchema->getTables() as $table) {
            $tableName = $table->getName();

            if ($schemaAssetsFilter($this->resolveTableName($tableName))) {
                continue;
            }

            $toSchema->dropTable($tableName);
        }

        return $toSchema;
    }

    private function replaceStatement(string $sql): string
    {
        return str_replace('$this->addSql', 'DB::statement', $sql);
    }

    /**
     * Resolve a table name from its fully qualified name. The `$name` argument
     * comes from Doctrine\DBAL\Schema\Table#getName which can sometimes return
     * a namespaced name with the form `{namespace}.{tableName}`. This extracts
     * the table name from that.
     */
    private function resolveTableName(string $name): string
    {
        $pos = strpos($name, '.');

        return $pos === false ? $name : substr($name, $pos + 1);
    }

    function run(): string
    {
        $schemaManager = $this->dependencyFactory->getConnection()->createSchemaManager();
        $fromSchema = $schemaManager->introspectSchema();
        $toSchema = $this->createToSchema();

        $platform = $this->dependencyFactory->getConnection()->getDatabasePlatform();
        $comparator = $schemaManager->createComparator();
        $upzz = $platform->getAlterSchemaSQL(
            $comparator->compareSchemas($fromSchema, $toSchema)
        );
        if (empty($upzz)) {
            throw NoChangesDetected::new();
        }
        $downzz = $platform->getAlterSchemaSQL(
            $comparator->compareSchemas($toSchema, $fromSchema)
        );
        $kv = $this->dependencyFactory->getConfiguration()->getMigrationDirectories();
        $fqcn = $this->dependencyFactory->getClassNameGenerator()->generateClassName(array_keys($kv)[0]);
        $uptext = $this->dependencyFactory->getMigrationSqlGenerator()->generate($upzz, true);
        $downtext = $this->dependencyFactory->getMigrationSqlGenerator()->generate($downzz, true);
        $file = $this->dependencyFactory
            ->getMigrationGenerator()
            ->generateMigration($fqcn, $this->replaceStatement($uptext), $this->replaceStatement($downtext));

        $name = dirname($file) . '/' . date('Y_m_d_His') . '_doctrine_migration.php';
        rename($file, $name);
        return $name;
    }

}
