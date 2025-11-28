# Contributing Guide

Thank you for considering contributing to this project.\
This document defines how to work with the repository efficiently and in
a way that respects the maintainers' time and the project's technical
direction.

## 📌 Before You Start

-   Read the **README** and understand the project purpose.
-   Review open **Issues** and **Discussions** before creating new ones.
-   For significant features, open an **Issue** first to align on scope
    before submitting a PR.
-   All contributors must follow the **Code of Conduct**.

## 🧱 Repository Structure

This project contains: - `/src` --- PHP core (classes, service
providers, transformations). - `/tools` --- Node-based utilities for JS
obfuscation, build scripts, mappings. - `/examples` --- Integration
examples. - `/.github` --- CI, CODEOWNERS, templates, policies.

Do not introduce new top-level directories without prior approval.

## 🚀 Development Setup

### Requirements

-   PHP ≥ 8.1\
-   Composer\
-   Node.js ≥ 18\
-   npm or pnpm\
-   Git

### Install dependencies
```bash
    composer install
    cd tools && npm install
```

## 🧪 Running Tests

All changes must be covered by tests.

### PHP tests
```bash
    composer test
```

### JS tests (tools)
```bash
    cd tools
    npm test
```

PRs without tests will be rejected.

## 📐 Coding Standards

### PHP

-   PSR-12 formatting.
-   Strict types required.
-   Avoid facades unless strictly necessary.
-   No dead code, no commented-out code.

### JavaScript

-   ES Modules only.
-   Use TypeScript where possible inside `/tools`.
-   No unused exports.
-   No console logs in production paths.

## 🔀 Branching Model

We follow a standard Git branching flow:

-   `main` --- protected; only merge via PR.
-   Feature branches:\
    `feature/<short-name>`
-   Bugfix branches:\
    `fix/<short-name>`
-   Chores / maintenance:\
    `chore/<description>`

Never push directly to `main`.

## 📝 Pull Request Requirements

Every PR **must**:

1.  Be created from a dedicated branch.\
2.  Target `main`.\
3.  Include tests for all new behavior.\
4.  Pass CI.\
5.  Respect CODEOWNERS review rules.\
6.  Update documentation if behavior changes.\
7.  Include a clear, technical description of the change.

### PR Title Convention

Use semantic prefixes:

-   `feat: ...`
-   `fix: ...`
-   `chore: ...`
-   `refactor: ...`
-   `docs: ...`
-   `test: ...`

### PR Review Expectations

-   Keep PRs small and focused. Large PRs will be rejected or asked to
    be split.
-   Respond to review comments within 72 hours.
-   Maintainers may request rework or additional tests.

## 🐛 Reporting Bugs

Before opening an Issue, confirm these steps:

-   Search existing issues.
-   Provide reproduction steps, expected behavior, actual behavior,
    environment info.
-   If the bug involves security or sensitive logic, email the
    maintainers privately.

## 📦 Releasing

Releases are performed by maintainers only.

## 🛡 Security Disclosure

If you discover a vulnerability or obfuscation bypass: **Do not open a
public issue.**\
Report privately to the maintainers:

*\[urgorrigaston@gmail.com\]*

## 🙏 Final Notes

Contributions are welcome, but maintainers enforce quality standards
strictly.\
Follow the guidelines above to accelerate your review and merge process.
