<?php

namespace GooGee\LaravelBuilder;

use GooGee\LaravelBuilder\Service\FileManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class SetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setupLaravelBuilder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'setup LaravelBuilder';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(FileManager $fileManager)
    {
        $file = FileManager::concat(FileManager::LaravelBuilderDirectory, 'URI');
        $uri = $fileManager->read($file) ?? 'http://localhost';
        $uri = $this->ask('please input the local server URI', $uri);
        $fileManager->write($file, trim($uri, ' /'));

        $file = FileManager::concat(FileManager::LaravelBuilderDirectory, '.gitignore');
        $fileManager->write($file, '*');

        $this->info('copy HTML files');
        $folder = base_path(FileManager::getHtmlDirectory());
        File::deleteDirectory($folder);
        File::copyDirectory(__DIR__ . '/build' . Constant::getVersion(), $folder);

        $file = FileManager::concat(FileManager::getHtmlDirectory(), '.gitignore');
        $fileManager->write($file, '*');

        $this->info('OK');
        return 0;
    }
}