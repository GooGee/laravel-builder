<?php

return [
    'db' => [
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '5432'),
        'dbname' => env('DB_DATABASE', ''),
        'user' => env('DB_USERNAME', ''),
        'password' => env('DB_PASSWORD', ''),
        'driver' => env('DB_DRIVER', 'pdo_pgsql'),
        'charset' => 'utf8',
        'default_table_options' => [
            'charset' => 'utf8',
            'collation' => 'utf8_bin',
        ],
    ],

    'ignore_schemas' => [
        'failed_jobs',
        'jobs',
        'migrations',
    ],

];
