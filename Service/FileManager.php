<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder\Service;

use GooGee\LaravelBuilder\Constant;
use League\Flysystem\FileAttributes;
use League\Flysystem\Filesystem;
use League\Flysystem\Local\LocalFilesystemAdapter;
use League\Flysystem\StorageAttributes;

class FileManager
{
    const DirectorySeparator = '/';
    const LaravelBuilderDirectory = Constant::NAME2;

    private Filesystem $fs;

    public function __construct()
    {
        $adapter = new LocalFilesystemAdapter(base_path());
        $this->fs = new Filesystem($adapter);
    }

    static function concat(string $parent, string $child)
    {
        if (str_ends_with($parent, self::DirectorySeparator)) {
            $parent = substr($parent, 0, -1);
        }
        if (str_starts_with($child, self::DirectorySeparator)) {
            $child = substr($child, 1);
        }
        return $parent . self::DirectorySeparator . $child;
    }

    static function concatArray(array $pathzz)
    {
        return implode(self::DirectorySeparator, $pathzz);
    }

    static function getHtmlDirectory()
    {
        $version = Constant::getVersion();
        return "public/build$version";
    }

    function delete(string $file)
    {
        $this->fs->delete($file);
    }

    function filezz(string $directory)
    {
        return $this->fs->listContents($directory)
            ->filter(fn(StorageAttributes $attributes) => $attributes->isFile())
            ->map(fn(StorageAttributes $attributes) => $attributes->path())
            ->toArray();
    }

    function getDirectory(string $file)
    {
        $data = pathinfo($file);
        return $data['dirname'];
    }

    function getFileName(string $file)
    {
        $data = pathinfo($file);
        return $data['basename'];
    }

    function getFileNameWithoutExtension(string $file)
    {
        $data = pathinfo($file);
        return $data['filename'];
    }

    function move(string $from, string $to)
    {
        if ($this->fs->fileExists($from)) {
            $this->fs->move($from, $to);
        }
    }

    function read(string $file)
    {
        if ($this->fs->fileExists($file)) {
            return $this->fs->read($file);
        }
        return null;
    }

    function readAll(string $folder)
    {
        $listing = $this->fs->listContents($folder);
        $filezz = [];
        foreach ($listing as $item) {
            if ($item instanceof FileAttributes) {
                $path = $item->path();
                $pi = pathinfo($path);
                $filezz[$pi['basename']] = $this->read($path);
            }
        }
        return $filezz;
    }

    function write(string $file, string $content)
    {
        $this->fs->write($file, $content);
    }

}