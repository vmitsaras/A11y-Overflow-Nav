# Basic Priority+ navigation

A polished, copy-friendly example of source-ordered navigation that moves links
into an accessible More disclosure when horizontal space runs out.

## What this example shows

- Semantic navigation that remains useful before JavaScript initializes.
- Original link nodes moving between the visible list and the More disclosure.
- A current-page state, responsive redistribution, and a live overflow count.
- An interactive width toggle that demonstrates overflow without resizing the browser.
- Consumer-owned Flexbox layout and demo-only presentation styles.

## How to run

Install dependencies and build the package first:

~~~bash
npm install
npm run build
~~~

Then serve the repository root and open `examples/basic/index.html`:

~~~bash
npx serve .
~~~

The page imports `../../dist/index.js`; opening it before the build completes
will produce a 404 for that file.

## What to try

- Use “Narrow preview” or resize the viewport until one or more links move into More.
- Tab to More, open it with Enter or Space, and close it with Escape.
- Use the menu’s arrow-key, Home, End, and typeahead behavior.
- Increase browser text size and confirm every destination remains available.

## Accessibility notes

- The landmark has the accessible name “Primary”.
- Links and the More trigger use native elements and native keyboard behavior.
- The plugin preserves source order and moves original nodes instead of clones.
- Responsive redistribution preserves focus when an active item must move.
- The live overflow count is consumer-authored example behavior; the core plugin
  emits lifecycle events but does not create live announcements.
- With JavaScript unavailable, all links remain in the primary list.
- Nested and mega-menu navigation are intentionally unsupported in v1.

## Developer notes

- Root selector: `[data-a11y-overflow-nav]`.
- Child selectors: the documented `data-overflow-nav-*` attributes in `index.html`.
- Initialization: `createOverflowNav(root)` from `../../dist/index.js`.
- CSS: `styles.css` is demo-only; the package intentionally ships no layout CSS.
- Options: defaults are used, including resize observation and fit tolerance.
- Full lifecycle timing and event payloads are demonstrated in the repository-root
  [`index.html`](../../index.html) scenario lab.

## Files

- `index.html` — semantic markup, initialization, and status text.
- `styles.css` — responsive demo presentation and navigation layout.
