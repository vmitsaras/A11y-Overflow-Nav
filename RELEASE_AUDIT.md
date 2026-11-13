# Release audit — v0.3

Status: 1.0.0 prepared locally on 2026-11-13; owner-reported AT/native zoom/text checks accepted; Git delivery, current-tree CI, and deployment/publication verification remain open

Historical local audit date: 2026-10-27

Historical v0.3 CI: `35751176276` — pass (2026-09-22 lineage, not the current working tree)

## Current status

The v0.3 title is a [planning milestone](ROADMAP.md#current-status--2026-11-13), not the package version. Stable **1.0.0** is now applied through Changesets at the owner's request, superseding the previous 0.1.1 patch plan. Its accumulated notes are retained in [CHANGELOG.md](CHANGELOG.md); the consumed Changeset is no longer a pending release item.

On **2026-11-13**, the owner reported **AT testing works** and **native browser zoom/text checks passed**. These close the corresponding package release gates on an owner-reported basis. AT/browser combinations and versions were not supplied, and the agent did not run those manual checks. The owner also retired **native Windows contrast-theme testing as a package gate** because the plugin ships no CSS and is integrated into sites with different styles. Contrast-theme, visible-focus, and current-page styling checks remain the responsibility of each consuming integration. Specific unreported AT/browser combinations remain unverified, without becoming an additional 1.0.0 package gate.

The [acceptance/version record](VERIFICATION.md#v1-owner-acceptance-and-version-preparation--2026-11-13) supersedes earlier open-gate summaries. The [November implementation/browser records](VERIFICATION.md#recorded-november-verification) and October audit below retain their dated targets and limits; their old sizes and fingerprints are not current 1.0.0 artifact measurements.

**Remaining release work:** deliberately deliver the release commit, including generated Pages and its generator; obtain current-tree CI; and verify deployment/publication when authorized. [Evidence and generated Pages remain local/untracked](VERIFICATION.md#evidence-delivery). The 2026-11-12 remote review confirmed correct main /docs settings but missing remote docs and a live 404; deployment has not been rechecked by this version-preparation pass.

The audit and follow-up timeline below preserve the original findings, fixes, measurements, and limits. In particular, statements about open AT/Windows/version gates inside those dated sections describe their historical state.

## Final local audit — 2026-10-27

**Local technical verdict: Pass. No confirmed code or package-content blocker found.** RA-01 was subsequently resolved by the release Changeset below; Changesets status now passes. The full release verdict remains conditional on the deliberately open manual/current-tree CI checks. No version application or publication is authorized by this record.

Target: the uncommitted working tree based on `6895d10e226fe8332a1b6eb740da079f759319d6`, after RH-03/RH-04 fixes. Package: **`a11y-overflow-nav@0.1.0`**, framework-agnostic TypeScript/ESM behavior library, unscoped public publish intent, npm, MIT. The installed runtime dependency is `a11y-menu-button@1.0.1` (declared `^1.0.1`). No lockfile is present; no dependency or version changes were made.

| Check | Result |
| --- | --- |
| Tests / types / build | Pass: **48 tests**, typecheck, full distribution/Pages build |
| Package contract and source review | Pass within inspected scope: runtime/docs/package.json exports and declarations agree; no automatic DOM initialization, runtime CSS export, framework dependency, or confirmed lifecycle blocker found |
| Dry-run and actual tarball | Pass: **12 files**, **26,044 bytes compressed / 97,809 bytes unpacked**; required JS, declarations, README, changelog, license, package metadata present; no demos/tests/local artifacts or credentials/config files included |
| Source maps | Intentional: `sourcemap: true` and `declarationMap: true`; maps are included in the 12-file allowlist |
| Isolated offline consumer | Pass: installed the locally packed plugin and locally packed installed Menu Button dependency into a fresh temporary directory, without lifecycle scripts/network installation |
| Public imports and types | Pass on Node **24.21.0** without a DOM: root runtime, `/docs`, and `/package.json` imports. Strict TypeScript NodeNext consumer compiles all exported root types and `PluginDocs`, without `skipLibCheck` |
| Generated Pages | Pass: copied CSS/distribution parity and local JS/CSS module graph for all three entrypoints; regeneration matches the pre-audit Pages backup |
| Fresh automated browser smoke | Pass: headless Chrome for Testing **153.0.8010.12**, **320 × 900**; all three generated pages initialize, retain original order/identity, keep final-link focus visible in an open panel, and return focus to More on Escape; no document/panel horizontal overflow or page/module errors in the samples |
| Diff / target preservation | Pass: `git diff --check`; product fingerprints unchanged during audit; pre-existing working-tree changes preserved |
| Lint | Not applicable: no lint script configured |
| Changesets release status | **Pass after RA-01 resolution:** one pending patch Changeset; version remains 0.1.0 |

The browser initially requested an absent `/favicon.ico`; that nonessential request is excluded from module-error assertions and is not a package blocker. Browser smoke is bounded interaction evidence, not a new full zoom/browser matrix or AT qualification. Earlier native text-size/zoom records still apply only to their unchanged fingerprinted targets and recorded scopes.

### RA-01 — Release changeset missing — resolved 2026-10-27

At audit time, `node node_modules/@changesets/cli/bin.js status --output /private/tmp/ovn-local-changeset-status.json` exited **1**: “Some packages have been changed but no changesets were found.” The package/changelog were at the **0.1.0 foundation baseline**, with no pending release changeset. This did not break the built tarball or consumer imports, but left Changesets release preparation unfinished.

**Resolution:** added [release notes originally prepared in a patch Changeset](CHANGELOG.md) for focus continuity, detached restoration, reentrant destruction, numeric normalization, demo accessibility/recovery, and RH-03/RH-04. Rerunning Changesets status exits **0** and reports one pending patch plan, **0.1.0 → 0.1.1**. This is a plan only: `package.json` remains **0.1.0**, and the changelog's versioned entries have not been generated or changed. Version application and publication were explicitly excluded by the user.

Fresh 48 tests, typecheck, build/Pages, package dry-run (12 files), parity, and diff checks pass. Product/package fingerprints are unchanged from the local audit. [Resolution evidence](output/playwright/ra01-resolution-2026-10-27/summary.json) and [Changesets status output](output/playwright/ra01-resolution-2026-10-27/changesets-status.json) are retained separately from the historical failed diagnostic. No version command, publish command, commit, or tag was run. Registry availability remains unverified.

### Open at the time of the 2026-10-27 audit

- **Windows light/dark contrast themes: Open.**
- **Current VoiceOver/NVDA and other AT checks: Open. Manual screen-reader testing was not run, as requested.**
- Wider chosen supported-browser/native-zoom/text-size qualification beyond the recorded samples: Open.
- Current-tree CI and final release/version/changelog synchronization: Open. Historical green CI is not current-tree CI.
- Registry availability, credentials, and fresh dependency-advisory lookup: Not run; this was a local audit.

Evidence: [`summary.json`](output/playwright/final-local-audit-2026-10-27/summary.json), [pack manifest](output/playwright/final-local-audit-2026-10-27/pack.json), [browser results](output/playwright/final-local-audit-2026-10-27/browser-smoke.json), [Pages module graph](output/playwright/final-local-audit-2026-10-27/pages-module-graph.json), and [target fingerprints](output/playwright/final-local-audit-2026-10-27/target-sha256.json). Consumer smoke sources and the Changesets diagnostic are retained in the same evidence folder. The records below are historical follow-ups.

Historical local follow-up: **2026-10-26** focused improvement pass. Confirmed focus/lifecycle and demo defects were fixed; 48 tests, typecheck, full build, package dry-run, independent review, and bounded Chromium browser checks passed. Generated Pages were synchronized. See `VERIFICATION.md` for the working-tree target and evidence limits. This local pass adds no new CI, publication, assistive-technology, or release-readiness claim; the open release-hardening checks below remain required.

Historical release-hardening follow-up: **2026-10-27**. RH-01 (lab horizontal overflow) and RH-02 (short-viewport disclosure closure/focus loss) were fixed in demo CSS and Pages regenerated. Final retests passed 48 layout/localization cases in Chrome 156 headless, 9 native zoom/locale cases in isolated Chrome for Testing 153, the original short-viewport keyboard reproduction, and 17 supplemental assertions. Local tests (48), typecheck, build, package dry-run, and parity/diff checks passed. See `VERIFICATION.md` for the exact versions, dimensions, and scope; native text-only resize, Windows contrast themes, current AT, and the chosen supported-browser/native matrix remain open.

Subsequent native text-only inspection: **2026-10-27**. Firefox 158/159 samples at 100/150/200% confirmed actual text resizing with unchanged viewport, DPR, and fixed-size calibration geometry. Basic and sampled English/Greek lab paths passed; **RH-03** (stress menu closes and loses focus on End at 200%) and **RH-04** (German lab panel horizontal scrolling at 200%) keep text-resize qualification open. Fresh local package gates passed; product files and Pages fingerprints are unchanged. This inspection does not add Windows contrast-theme or AT evidence.

Historical disposition: **2026-10-27 RH-03 classification** confirms stress-demo CSS rather than an Overflow Nav JavaScript defect. Native Firefox 159 logs the dependency's `visibility-change` close after focus scroll moves More offscreen; a temporary CSS-only available-height bound keeps Account focused and the panel open with identical JavaScript. Per user scope, RH-03 and lab-only RH-04 are excluded from runtime release blockers. Their historical observations remain recorded. Fresh local package gates pass; no product fix was applied. Windows contrast themes and current AT remain unverified.

Subsequent requested fixes: **2026-10-27**. RH-03 now respects available panel height/top placement in stress CSS; RH-04 wraps long lab disclosure labels. Four native Firefox 159 source/Pages checks at 200% text-only size pass, including final-link focus and zero horizontal panel overflow. Pages was regenerated; runtime JavaScript is unchanged. Local package/parity/diff gates pass. Manual screen-reader tests were not run, as requested.

## Historical v0.3 evidence

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

## Remaining release work

- release commit and deliberate delivery of the intended source, generator, generated Pages, and selected evidence;
- passing CI for the actual release commit;
- verification of Pages deployment and npm publication when authorized.

AT and native browser zoom/text checks are accepted by the owner for this release; Windows contrast-theme testing is retired as a package gate. Additional browser/AT matrices, including specific NVDA combinations not identified in the report, remain optional integration qualification. See the [2026-11-13 acceptance record](VERIFICATION.md#v1-owner-acceptance-and-version-preparation--2026-11-13) for the exact evidence limits.

## Release decision

Local version/changelog preparation is complete at **1.0.0**. The owner-reported manual gates are accepted and the Windows styling gate is retired. Full release delivery remains in progress until the release commit, its CI, and the authorized deployment/publication have been verified. This version-preparation pass does not itself publish or deploy.
