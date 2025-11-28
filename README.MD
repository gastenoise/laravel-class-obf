# Laravel Class Obfuscator

A build-time tool that **obfuscates PHP and JavaScript classes** inside a Laravel application.  
Reduces code readability in production builds to limit casual inspection and reverse-engineering.

This package is part of a two-stage system:

1. **PHP Obfuscation + Proxy Loader**  
2. **JavaScript Runtime Dictionary** used by assets built with Vite/Rollup

---

## 🚨 Important — Read This First

This project **does not provide real security**.  
Obfuscation only slows down attackers; it does *not* prevent code extraction or analysis.

If you treat this as a security feature, you will ship a false sense of protection.  
Use this package only to:

- Discourage copy-paste piracy  
- Reduce trivial code scraping  
- Hide method names, helper names or class names from public vendors  
- Break basic static scans

If you need actual security, you need **access control**, **permissions**, **backend boundaries**, **encryption**, and **audits** — not obfuscation.

---

## 💡 What This Package Does

- Obfuscates **class names**, **method names**, **property names**, and **helper names**.
- Generates a **mapping dictionary** used by both PHP and JS.
- Injects a **PHP autoloader proxy** during build.
- Provides a **JavaScript runtime dictionary** that replaces exported names during Vite build.
- Splits **dev** and **prod** builds:
  - Dev: *no obfuscation*, readable stack traces.
  - Prod: full obfuscation + dictionary mapping.

---

## 📦 Installation

```bash
composer require your-vendor/laravel-class-obf --dev
npm install @your-vendor/laravel-class-obf --save-dev
Laravel will auto-discover the service provider.
```

---

## 🔧 Usage

1) Enable obfuscation in production builds
```php
// config/class-obf.php
return [
    'enabled' => env('CLASS_OBF_ENABLED', false),
    'output_path' => storage_path('class-obf'),
    'map_file' => 'mapping.json',
];
```
In your CI or deploy scripts:
```bash
php artisan class-obf:build
npm run build
```

2) Disable obfuscation locally
In .env:
```ini
CLASS_OBF_ENABLED=false
```
No obfuscation → readable code.

---

## 📁 Folder Structure (after installation)

src/ — PHP package: generator, autoloader, commands
tools/ — Node utilities used to rewrite the JS bundle
js-runtime/ — Vite/Rollup plugin + runtime dictionary
examples/ — Sample Laravel project integration
.github/ — CI, CODEOWNERS, templates

---

## 🧪 Testing

PHP:
```bash
vendor/bin/phpunit
```

JS:
```bash
cd tools
npm test
```

---

## 🏗 Build Process Overview

Inspect project classes (reflection + AST).
Generate signature → obfuscated name.
Produce mapping.json.
Rewrite PHP class references.
Rewrite JS exports/imports through Vite plugin.
Bundle assets.
Publish obfuscated artifacts.
If any step fails, the build breaks — no silent fallbacks.

---

## 🧷 Safety Notes

Never commit mapping.json publicly unless this is intended.
Do not store the dictionary in client-side code unguarded.
Do not rely on this for secrets or authorization logic.
Obfuscation will break reflection-heavy libraries unless explicitly configured.

---

## 🛠 Development Mode vs Production Mode

**dev** - No obfuscation. Classes and JS exports readable. Fast build.
**prod** - Full obfuscation. Dictionary generated. Code rewritten.

---

## 🤝 Contributing
We enforce **strict** CODEOWNERS and CI rules.

To contribute:
- Fork and clone the repo.
- Create a feature branch.
- Add tests.
- Open a PR with a clear description.
- Wait for CODEOWNERS review.

Every PR must pass:
1. PHP tests
2. JS tests
3. Linting
4. CI matrix build

PRs without tests are **rejected**.

---

## 📄 License
MIT — see the LICENSE file.

---

## 📬 Contact / Issues
Open GitHub Issues for bugs or feature requests.
Security-related issues should be emailed privately to the maintainers.