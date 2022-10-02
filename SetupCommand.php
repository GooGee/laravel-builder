<?php

namespace GooGee\LaravelBuilder;

use GooGee\LaravelBuilder\Service\FileManager;
use Illuminate\Console\Command;

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
        $fileManager->write($file, $uri);

        $file = FileManager::concat(FileManager::LaravelBuilderDirectory, '.gitignore');
        $fileManager->write($file, '*');

        $fileManager->write(FileManager::getHtmlDirectory() . '/.gitignore', '*');

        $this->info('OK');
        return 0;
    }
}