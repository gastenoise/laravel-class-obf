<?php

return [

    // TOKEN / SECURITY
    'secret' => env('CLASS_OBF_SECRET'),

    'token_length' => env('CLASS_OBF_TOKEN_LENGTH', 8),

    // MODE: dev | production
    'mode' => env('CLASS_OBF_MODE', 'dev'),

    // SCAN CONFIG
    'scan' => [
        'paths' => [
            resource_path(),
            base_path('resources'),
            public_path(),
        ],
        'extensions' => [
            '.blade.php',
            '.html',
            '.css',
            '.js',
            '.vue',
        ],
    ],

    // OUTPUT / MAPPING
    'mapping_path' => storage_path('app/class-obf-mapping.json'),
    'out_dir' => public_path('build-obf'),

    'publish_mapping_to_public' => env('CLASS_OBF_PUBLISH_MAPPING', false),

    // BEHAVIOR — BASE WHITELIST
    'whitelist' => [
        '/^data-.+$/',
        '/^aria-.+$/',
        '/^role-.+$/',

        // common UI classes that should NOT be obfuscated
        'active', 'open', 'show', 'hidden', 'block', 'collapse', 'collapsed',
        'modal', 'dropdown', 'tooltip', 'overlay',

        // common JS behavior toggles
        '/^is-.+$/',
        '/^has-.+$/',
    ],

    // DEV MODES
    'dev_modes' => [
        'log' => env('CLASS_OBF_LOG', false),
        'dump_unmapped' => env('CLASS_OBF_DUMP_UNMAPPED', false),
    ],
];
