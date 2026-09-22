# AGENTS.md

## Repository purpose

A11y Overflow Nav is a standalone TypeScript accessibility plugin implementing Priority+ navigation behavior.

## Non-negotiable architecture

- Keep the package framework-agnostic and ESM-only.
- Use semantic HTML and progressive enhancement.
- Move original navigation item nodes. Never clone managed destinations.
- Preserve canonical source order.
- Do not introduce viewport breakpoints.
- Do not implement Menu Button interaction here. Use `a11y-menu-button/core`.
- Keep Flex/Grid styling consumer-owned.
- No automatic initialization on import.
- No MutationObserver unless a future approved specification adds it.
- No nested/mega-menu support without an explicit architecture decision.

## Implementation rules

- Frozen defaults/selectors/attributes/event constants.
- Normalize programmatic and dataset options.
- Reuse duplicate instances with WeakMap.
- Bind handlers once.
- Disconnect observers and cancel animation frames in `destroy()`.
- Bubble lifecycle events.
- Keep the public API small.
- Preserve focus intentionally when responsive redistribution would otherwise hide the active element.

## Public API compatibility

The intended v1 API is:

- `A11yOverflowNav`
- `createOverflowNav()`
- `initOverflowNavs()`
- `visibleItems`
- `overflowItems`
- `overflowCount`
- `refresh()`
- `destroy()`

Treat breaking changes to that surface as explicit decisions.

## CSS

The package is behavior-only and should not ship layout CSS unless a future requirement justifies it. Demo CSS is not runtime package CSS.

## Verification

Before declaring a slice verified, run the checks relevant to the change. At minimum:

- tests
- typecheck
- build
- pack dry-run

Geometry-sensitive behavior requires real-browser evidence; happy-dom tests are not proof of Flex/Grid layout correctness.

## Scope discipline

Avoid unrelated refactors and new runtime dependencies. Persist architecture/product decisions in repository docs rather than only in chat.
