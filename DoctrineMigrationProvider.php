<?php

declare(strict_types=1);

namespace GooGee\LaravelBuilder;

use Doctrine\DBAL\DriverManager;
use Doctrine\Migrations\Configuration\Configuration;
use Doctrine\Migrations\Configuration\EntityManager\ExistingEntityManager;
use Doctrine\Migrations\Configuration\Migration\ExistingConfiguration;
use Doctrine\Migrations\DependencyFactory;
use Doctrine\Migrations\Metadata\Storage\TableMetadataStorageConfiguration;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\ORMSetup;
use GooGee\LaravelBuilder\Doctrine\EventListener\FixPostgreSQLDefaultSchemaListener;
use Illuminate\Support\ServiceProvider;

class DoctrineMigrationProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(DependencyFactory::class, function ($app) {
            $cc = config('laravelbuilder');
            $ac = ORMSetup::createAttributeMetadataConfiguration([base_path('database/Entity')], true);
            $ac->setSchemaAssetsFilter(function ($name) use ($cc) {
                if (is_string($name)) {
                    foreach ($cc['ignore_schemas'] as $text) {
                        if (str_starts_with($name, $text)) {
                            return false;
                        }
                    }
                }
                return true;
            });
            $connection = DriverManager::getConnection($cc['db'], $ac);
            $em = new EntityManager($connection, $ac);
            $em->getEventManager()->addEventListener('postGenerateSchema', new FixPostgreSQLDefaultSchemaListener());

            $configuration = new Configuration();
            $configuration->setAllOrNothing(true);
            $configuration->setCheckDatabasePlatform(false);
            $configuration->setCustomTemplate(__DIR__ . '/DoctrineMigration.stub');
            $configuration->addMigrationsDirectory('Database\\Migrations', base_path('database/migrations'));

            $storageConfiguration = new TableMetadataStorageConfiguration();
            $storageConfiguration->setTableName('migrations');
            $configuration->setMetadataStorageConfiguration($storageConfiguration);

            return DependencyFactory::fromEntityManager(
                new ExistingConfiguration($configuration),
                new ExistingEntityManager($em)
            );
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

}
