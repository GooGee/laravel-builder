<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

use Doctrine\Migrations\DependencyFactory;
use Doctrine\ORM\EntityManagerInterface;

class MigrationService
{
    const Folder = 'database/migrations';
    const Table = 'migrations';

    private EntityManagerInterface $em;

    public function __construct(private FileManager $fileManager, private DependencyFactory $dependencyFactory)
    {
        $this->em = $dependencyFactory->getEntityManager();
    }

    function delete(string $file)
    {
        $path = $this->fileManager->concat(self::Folder, $file);
        $this->fileManager->delete($path);
    }

    function getAllFile()
    {
        return $this->fileManager->listFilezz(self::Folder);
    }

    function getAllInDB()
    {
        try {
            $table = self::Table;
            $all = $this->em->getConnection()
                ->prepare("SELECT * FROM `$table`")
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
