# Changelog

This package uses Changesets for release notes.

Version **1.0.0** was prepared locally on **2026-11-13** using the project Changesets workflow. The owner-requested stable version supersedes the earlier 0.1.1 patch plan. This entry records version preparation, not publication. Roadmap v0.x labels describe planning milestones.

## 1.0.0

### Major Changes

- Prepare the first stable 1.0.0 version of A11y Overflow Nav, as requested by the project owner. This promotes the existing public API without adding a breaking API change or new runtime dependency. Include the accumulated focus, lifecycle, option-normalization, demo, and documentation improvements below.

  - Preserve the active destination through refresh and responsive redistribution. Move focus to More when the destination ends in a closed overflow panel, restore a destination when More disappears, and preserve focus outside the navigation.
  - Restore canonical item order during refresh and destruction even when the navigation is detached. Support reattachment and reinitialization while leaving removed or externally reparented items untouched.
  - Stop initialization, refresh, and reflow when a synchronous callback destroys the instance, preventing later observation, scheduled work, state writes, or completion events.
  - Validate complete finite, nonnegative tolerance values; reject blank, malformed, negative, and infinite values while preserving programmatic option precedence.
  - Improve demo language metadata, wrapping fallbacks, stress-control serialization, and failure recovery. Keep selected measurement layouts limited to the enhanced state.
  - Fix demo disclosure width and available-height handling, including stress-menu End-key focus at 200% text size and wrapping long German lab labels without horizontal scrolling. Regenerate the static Pages examples with the updated styles and package runtime.
  - Improve demo lifecycle controls and width feedback, keep narrow basic/stress disclosures within the viewport, and report focused lab controls by their labels. Use matching fictional nature-reserve destinations and localized variants across the examples.
  - Settle stress runs at the requested starting width, wait three animation frames before sampling, report measured width ranges, and clear stale results after manual width changes. These fixture changes require a fresh comparison baseline and do not claim faster package execution.
  - Connect the examples with relative navigation and consumer-owned stylesheet links. Align lifecycle documentation with ordered node-sequence changes and show removal of consumer lifecycle listeners during teardown.

## 0.1.0

Initial implementation foundation for Priority+ overflow navigation. This entry describes the current repository baseline and is not a published-release claim.
