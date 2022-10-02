<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

class SettingFileService
{
    const BackupFolder = 'backup';
    const FileName = 'data.json';

    public function __construct(private FileManager $fileManager)
    {
    }

    function getFilePath()
    {
        return FileManager::concat(FileManager::LaravelBuilderDirectory, self::FileName);
    }

    function makeBackup()
    {
        $dt = new \DateTime();
        $name = $dt->format('Y-m-d_H_i_s') . '.json';
        $to = FileManager::concatArray([FileManager::LaravelBuilderDirectory, self::BackupFolder, $name]);
        $this->fileManager->move($this->getFilePath(), $to);
    }

    function read()
    {
        return $this->fileManager->read($this->getFilePath());
    }

    function write(string $text)
    {
        $this->fileManager->write($this->getFilePath(), $text);
    }

}