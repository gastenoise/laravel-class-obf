<?php

return [
    'mode' => env('CLASS_OBF_MODE', 'development'),

    'secret' => env('CLASS_OBF_SECRET', 'CHANGE_ME'),

    'token_length' => 8,

    'publish_mapping_to_public' => false,
];
