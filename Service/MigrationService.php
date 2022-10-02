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
        $filezz = [];
        $all = $this->fileManager->readAll(self::Folder);
        foreach ($all as $key => $item) {
            if (str_ends_with($key, '.php')) {
                $filezz[] = [
                    'name' => $key,
                    'content' => $item,
                ];
            }
        }
        return $filezz;
    }

    function getAllInDB()
    {
        try {
            $all = $this->em->getConnection()
                ->prepare('SELECT * FROM ' . self::Table)
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