<?php

namespace GooGee\LaravelBuilder\Doctrine\Migration;

use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Generator\Exception\NoChangesDetected;
use Doctrine\Migrations\Provider\OrmSchemaProvider;

class CreateMigrationService
{
    private AbstractSchemaManager $schemaManager;
    private OrmSchemaProvider $schemaProvider;

    public function __construct(private DependencyFactory $dependencyFactory)
    {
        $this->schemaManager = $dependencyFactory->getConnection()->createSchemaManager();
        $this->schemaProvider = new OrmSchemaProvider($dependencyFactory->getEntityManager());
    }

    private function createFromSchema(): Schema
    {
        return $this->schemaManager->introspectSchema();
    }

    private function createToSchema(): Schema
    {
        $schemazz = $this->schemaProvider->createSchema();

        $schemaAssetsFilter = $this->dependencyFactory->getConnection()->getConfiguration()->getSchemaAssetsFilter();

        if ($schemaAssetsFilter !== null) {
            foreach ($schemazz->getTables() as $table) {
                $tableName = $table->getName();

                if ($schemaAssetsFilter($this->resolveTableName($tableName))) {
                    continue;
                }

                $schemazz->dropTable($tableName);
            }
        }

        return $schemazz;
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
        $fromSchema = $this->createFromSchema();
        $toSchema = $this->createToSchema();
        $platform = $this->dependencyFactory->getConnection()->getDatabasePlatform();
        $comparator = $this->schemaManager->createComparator();
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
