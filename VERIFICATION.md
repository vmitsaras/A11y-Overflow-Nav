# Verification — A11y Overflow Nav

Date: 2026-09-22  
Manual verification target: `62fdf29f0b86d02dd86a0afa4c650bd19fa22376`  
Latest v0.3 implementation head: `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`  
Latest automated run: `35751176276`

## Summary

The current implementation has both package-level automated evidence and project-owner manual real-browser accessibility evidence.

The project owner reported testing the current implementation in a real browser with VoiceOver and reported the result as **verified / passed**.

This record intentionally distinguishes that manual evidence from checks that were not explicitly reported, such as a full Chromium/Firefox/WebKit automation matrix, forced-colors testing, or NVDA coverage.

## Automated package gates

For v0.3 implementation head `c471e26ad96f75fc62940547ae32da8ee4bbf0e0`, GitHub Actions run `35751176276` completed successfully.

| Check | Status | Evidence |
| --- | --- | --- |
| Dependency installation | Pass | GitHub Actions run 35751176276 |
| Unit/lifecycle tests | Pass | CI |
| TypeScript integrity | Pass | CI |
| Package build | Pass | CI |
| Package contents | Pass | CI |

## v0.3 performance-hardening evidence

The current hardening slice added:

- a developer-only 24-item real-browser stress fixture;
- ResizeObserver/requestAnimationFrame coalescing regression coverage;
- pending-frame cancellation coverage for `destroy()`;
- a source-level performance review;
- an in-progress release-audit checklist.

The new automated tests passed in GitHub Actions run `35751176276`. No runtime diagnostics, polling, persistence, or new runtime dependency were added.

Actual stress-fixture timing measurements remain manual and are intentionally not inferred from CI.

## Manual real-browser evidence

Reported by the project owner on 2026-09-22:

| Check | Status | Evidence |
| --- | --- | --- |
| Real-browser functional verification | Pass | Manual project-owner test |
| VoiceOver verification | Pass | Manual project-owner test |
| Blocking regression found | No | Manual project-owner report |

The exact browser/version and operating-system version were not recorded in the report, so this verification note does not infer them.

## Previously resolved implementation regression

### V-01 — Refresh order reconciliation

**Observed:** An earlier CI run found that a newly inserted primary item could be reordered behind the previous canonical items during `refresh()`.

**Resolution:** `refresh()` now captures current direct primary-item DOM order before rebuilding the canonical sequence and restoring/reflowing.

**Result:** Subsequent automated package gates passed.

## Verification boundary

Verified now:

- package install/test/typecheck/build/pack checks;
- current implementation in a real browser;
- VoiceOver manual interaction pass;
- no reported blocking regression in that manual pass.

Not yet claimed as verified:

- automated Chromium/Firefox/WebKit geometry matrix;
- fractional-width threshold automation;
- repeated threshold-cycle automation;
- 200–400% zoom;
- browser text-only resize;
- forced-colors behavior;
- NVDA/browser combinations;
- performance stress measurements from the new fixture.

## Next verification slice

v0.3 release hardening:

1. run and record the new performance stress fixture in a real browser;
2. zoom/text-size checks;
3. forced-colors checks;
4. NVDA/browser coverage if in the supported release matrix;
5. package release audit;
6. final documentation synchronization.

## Final status

**Core implementation verified through automated package gates plus manual real-browser and VoiceOver testing. Release-hardening checks remain open.**
