<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

use Doctrine\Migrations\DependencyFactory;
use Doctrine\ORM\EntityManagerInterface;

class MigrationService
{
    const Folder = 'database/migrations';
    const Table = 'migrations';

    public function __construct(private FileManager $fileManager, private DependencyFactory $dependencyFactory)
    {
    }

    function delete(string $file): void
    {
        $path = $this->fileManager->concat(self::Folder, $file);
        $this->fileManager->delete($path);
    }

    function getAllFile(): array
    {
        return $this->fileManager->listFilezz(self::Folder);
    }

    function getAllInDB(): array
    {
        try {
            $table = self::Table;
            $all = $this->dependencyFactory
                ->getConnection()
                ->createQueryBuilder()
                ->from($table)
                ->select('*')
                ->executeQuery()
                ->fetchAllAssociative();
            return $all;
        } catch (\Exception $exception) {
            $message = $exception->getMessage();
            if (strpos($message, self::Table)) {
                return [];
            }
            throw $exception;
        }
    }
}
