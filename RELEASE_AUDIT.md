# Release audit — v0.3

Status: In progress  
Date: 2026-09-22  
Latest v0.3 CI: `35751176276` — pass

## Current evidence

- TypeScript / ESM package structure implemented.
- Runtime dependency limited to `a11y-menu-button`.
- Package install, tests, typecheck, build, and pack dry-run have passed in GitHub Actions for the verified implementation lineage.
- Manual real-browser behavior passed.
- VoiceOver manual verification passed.
- Progressive-enhancement fallback is documented.
- No runtime stylesheet is shipped by A11y Overflow Nav.
- Performance stress fixture and scheduling regression tests are now part of the repository.
- Manual stress-fixture measurements were recorded in a real browser; see `VERIFICATION.md` for environment and values.
- The v0.3 performance-hardening commit passed install, tests, typecheck, build, and package dry-run in GitHub Actions run `35751176276`.

## Package contract review

Current public runtime surface remains intentionally small:

- `A11yOverflowNav`
- `createOverflowNav()`
- `initOverflowNavs()`
- distribution getters
- `refresh()`
- `destroy()`
- lifecycle events and exported types

The v0.3 performance work adds no runtime API and no runtime dependency.

## Open release-hardening evidence

The following remain open and must not be inferred as passing:

- 200–400% zoom;
- browser text-size checks;
- forced-colors checks;
- NVDA/browser combinations if Windows AT support is part of the release matrix;
- optional automated Chromium/Firefox/WebKit geometry coverage.

## Release decision

Do not mark the package release audit complete until the chosen manual release matrix is finished and the final CI run is green.

Current verdict: **release hardening in progress; no new blocking implementation defect identified in source review.**
