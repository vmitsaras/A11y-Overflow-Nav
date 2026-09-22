export interface PluginDocs {
  slug: string;
  name: string;
  packageName: string;
  description: string;
  repo?: string;
  install: { npm: string; pnpm: string; yarn: string };
  usage: string;
  selectors?: string[];
  keyboard?: Array<{ key: string; description: string }>;
  api: Array<{ name: string; type: string; description: string }>;
  examples?: Array<{ name: string; description: string; path: string }>;
}

export const docs = {
  slug: 'a11y-overflow-nav',
  name: 'A11y Overflow Nav',
  packageName: 'a11y-overflow-nav',
  description:
    'Priority+ navigation behavior that moves source-ordered items into an accessible More disclosure when the navigation no longer fits on one line.',
  repo: 'https://github.com/vmitsaras/A11y-Overflow-Nav',
  install: {
    npm: 'npm install a11y-overflow-nav a11y-menu-button',
    pnpm: 'pnpm add a11y-overflow-nav a11y-menu-button',
    yarn: 'yarn add a11y-overflow-nav a11y-menu-button',
  },
  usage: "import { createOverflowNav } from 'a11y-overflow-nav';\n\nconst root = document.querySelector('[data-a11y-overflow-nav]');\nif (root instanceof HTMLElement) {\n  createOverflowNav(root);\n}",
  selectors: [
    '[data-a11y-overflow-nav]',
    '[data-overflow-nav-list]',
    '[data-overflow-nav-item]',
    '[data-overflow-nav-control]',
    '[data-overflow-nav-menu]',
    '[data-overflow-nav-overflow-list]',
  ],
  keyboard: [
    {
      key: 'Tab',
      description:
        'Uses native document tab order. Responsive redistribution keeps source order intact.',
    },
    {
      key: 'Enter / Space',
      description:
        'The More trigger uses native button activation through A11y Menu Button.',
    },
    {
      key: 'ArrowDown / ArrowUp, Home / End, Escape, typeahead',
      description:
        'Overflow disclosure keyboard behavior is delegated to A11y Menu Button.',
    },
  ],
  api: [
    {
      name: 'createOverflowNav(root, options)',
      type: '(root: HTMLElement, options?: A11yOverflowNavOptions) => A11yOverflowNav',
      description: 'Initializes one overflow navigation and reuses an existing instance.',
    },
    {
      name: 'initOverflowNavs(root, options)',
      type: '(root?: ParentNode, options?: A11yOverflowNavOptions) => A11yOverflowNav[]',
      description: 'Explicitly initializes matching roots without auto-running on import.',
    },
    {
      name: 'refresh()',
      type: '() => void',
      description: 'Reconciles application-driven item additions/removals and recalculates layout.',
    },
    {
      name: 'destroy()',
      type: '() => void',
      description: 'Disconnects observation, restores source order, and destroys the owned menu button.',
    },
  ],
  examples: [
    { name: 'Basic', description: 'Minimal semantic Priority+ navigation.', path: 'examples/basic' },
    { name: 'Scenario lab', description: 'Interactive layout and lifecycle scenarios.', path: 'index.html' },
  ],
} satisfies PluginDocs;
