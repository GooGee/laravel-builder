<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Doctrine\Migration;

use Doctrine\DBAL\Schema\AbstractSchemaManager;
use Doctrine\DBAL\Schema\Column;
use Doctrine\DBAL\Schema\ForeignKeyConstraint;
use Doctrine\DBAL\Schema\Index;
use Doctrine\DBAL\Schema\Schema;
use Doctrine\DBAL\Schema\Table;
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

    static function makeColumn(Column $column)
    {
        $data = [
            'name' => $column->getName(),
            'type' => $column->getType()->getName(),
            'default' => $column->getDefault(),
            'comment' => $column->getComment() ?? '',
            'length' => $column->getLength() ?? 0,
            'scale' => $column->getScale(),
            'nullable' => $column->getNotnull() === false,
            'unsigned' => $column->getUnsigned(),
        ];
        if (in_array($data['type'], ['decimal', 'float'])) {
            $data['length'] = $column->getPrecision();
        }
        return $data;
    }

    static function makeIndex(Index $index)
    {
        $name = $index->getName();
        if (strtolower($name) === 'primary') {
            return null;
        }

        return [
            'name' => $name,
            'type' => $index->isUnique() ? 'unique' : 'index',
            'columnzz' => $index->getColumns(),
        ];
    }

    static function makeRelation(ForeignKeyConstraint $constraint)
    {
        $data = [
            'columnzz' => $constraint->getLocalColumns(),
            'schema' => $constraint->getForeignTableName(),
        ];
        return $data;
    }

    static function makeTable(Table $table)
    {
        $data = [
            'name' => $table->getName(),
            'comment' => $table->getComment(),
            'columnzz' => [],
            'indexzz' => [],
            'relationzz' => [],
        ];
        foreach ($table->getColumns() as $item) {
            $data['columnzz'][] = static::makeColumn($item);
        }
        foreach ($table->getForeignKeys() as $item) {
            $data['relationzz'][] = static::makeRelation($item);
        }
        foreach ($table->getIndexes() as $item) {
            $index = static::makeIndex($item);
            if (isset($index)) {
                $data['indexzz'][] = $index;
            }
        }
        return $data;
    }

    static function toArray(Schema $schema)
    {
        $data = [
            'name' => $schema->getName(),
            'tablezz' => [],
        ];
        foreach ($schema->getTables() as $item) {
            $data['tablezz'][] = static::makeTable($item);
        }
        return $data;
    }
}