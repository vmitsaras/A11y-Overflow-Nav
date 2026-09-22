# Architecture

## Goal

Keep as many source-ordered top-level navigation items visible as the current navigation container can accommodate on one line, moving the remaining suffix into an accessible More disclosure.

## Responsibility boundary

| Layer | Owns |
| --- | --- |
| HTML | navigation landmark, list semantics, labels, destinations, current-page state |
| CSS | Flex/Grid/layout styling and visual design |
| A11y Overflow Nav | fit detection, node redistribution, focus continuity, ResizeObserver lifecycle, refresh, restoration |
| A11y Menu Button | More trigger, expanded state, keyboard interaction, Escape, focus-out/outside close, panel placement |

Overflow Nav imports only `a11y-menu-button/core`.

## Canonical-order invariant

The original managed item array is authoritative.

For `A B C D E`, every stable state must be:

- a source-ordered prefix in the primary list;
- followed by the overflow control when overflow exists;
- with the remaining source-ordered suffix in the overflow list.

The implementation moves original nodes. It never clones destinations.

## Layout model

The component targets horizontal one-line navigation. It does not special-case Flex or Grid.

A fit probe uses actual rendered geometry:

1. overflow of the primary list;
2. participant bounds against the list bounds;
3. participant block position to detect an additional row;
4. a small configurable tolerance for fractional pixels.

## Reflow lifecycle

ResizeObserver invalidates layout. It does not redistribute synchronously.

`ResizeObserver → requestAnimationFrame → one reflow transaction`

Reflow first attempts to restore overflow items while they fit, then moves primary items to overflow until the one-line contract is satisfied.

The final overflow item is tested with the More control removed from layout because the item may fit only after More disappears.

## Structural changes

v1 uses explicit `refresh()` for application-driven item additions/removals.

MutationObserver automation is intentionally deferred.

## Focus

Node identity is preserved across moves. When a focused item would become hidden inside a closed panel, focus moves to More before the item is moved. When More disappears, focus is moved to the restored destination.

## Destruction

`destroy()` disconnects observation, cancels scheduled work, restores canonical item order, destroys the owned Menu Button instance, restores plugin-owned root attributes, restores the original More hidden state, and releases the WeakMap instance.
