<?php

return [
    'db' => [
        'host' => env('DB_HOST', '127.0.0.1'),
        'port' => env('DB_PORT', '3306'),
        'dbname' => env('DB_DATABASE', ''),
        'user' => env('DB_USERNAME', ''),
        'password' => env('DB_PASSWORD', ''),
        'driver' => env('DB_DRIVER', 'pdo_mysql'),
        'charset' => 'utf8mb4',
        'default_table_options' => [
            'charset' => 'utf8mb4',
            'collate' => 'utf8mb4_unicode_ci',
        ],
    ],

    'ignore_schemas' => [
        'migrations',
    ],

];
