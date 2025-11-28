#!/usr/bin/env node

// Por ahora: mock
console.log(JSON.stringify({
    status: "ok",
    message: "Obfuscator placeholder",
    mapping: {
        "btn-primary": "c1234567",
        "text-lg": "c89abcd0"
    }
}, null, 2));
