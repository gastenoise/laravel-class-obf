<?php

namespace ClassObf;

use Illuminate\Support\ServiceProvider;
use ClassObf\Commands\BuildCommand;

class ClassObfServiceProvider extends ServiceProvider {
    public function register() {
        $this->mergeConfigFrom(__DIR__ . '/../config/classobf.php', 'classobf');
    }

    public function boot() {
        $this->publishes([
            __DIR__ . '/../config/classobf.php' => config_path('classobf.php'),
        ], 'classobf-config');

        if ($this->app->runningInConsole()) {
            $this->commands([
                BuildCommand::class,
            ]);
        }
    }
}
