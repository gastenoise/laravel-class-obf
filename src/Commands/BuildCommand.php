<?php

namespace ClassObf\Commands;

use Illuminate\Console\Command;

class BuildCommand extends Command {
    protected $signature = 'classobf:build {--mode=production}';
    protected $description = 'Build obfuscated classes mapping';

    public function handle() {
        $mode = $this->option('mode');

        $this->info("Running ClassObf build (mode: $mode)");

        $cmd = base_path('tools/obfuscate.js');

        if (! file_exists($cmd)) {
            $this->error("Node tool not found: $cmd");
            return Command::FAILURE;
        }

        $process = proc_open(
            ["node", $cmd],
            [
                1 => ['pipe', 'w'], // stdout
                2 => ['pipe', 'w'], // stderr
            ],
            $pipes,
            base_path()
        );

        if (! is_resource($process)) {
            $this->error("Failed to start Node process.");
            return Command::FAILURE;
        }

        $output = stream_get_contents($pipes[1]);
        $error  = stream_get_contents($pipes[2]);

        fclose($pipes[1]);
        fclose($pipes[2]);

        $exitCode = proc_close($process);

        if ($error) {
            $this->error("Node error: $error");
        }

        if ($exitCode !== 0) {
            $this->error("Node process failed with exit code $exitCode");
            return Command::FAILURE;
        }

        $data = json_decode($output, true);

        if (! $data) {
            $this->error("Invalid JSON output from Node tool.");
            return Command::FAILURE;
        }

        $this->info("Node tool executed successfully.");
        $this->info("Mapping keys: " . implode(', ', array_keys($data['mapping'] ?? [])));

        // TODO: guardar mapping.json en storage/app/class-obf-mapping.json
        // TODO: generar public/build-obf/* en el próximo paso

        return Command::SUCCESS;
    }
}
