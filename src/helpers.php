<?php

if (! function_exists('cls')) {
    function cls(string $class) {
        return config('classobf.mode') === 'production'
            ? $class // placeholder
            : $class;
    }
}

if (! function_exists('asset_obf')) {
    function asset_obf(string $path) {
        return asset($path);
    }
}
