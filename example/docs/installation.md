---
sidebar_position: 2
---

# Installation

## Install

```bash
npm install @wjmpantig/docusaurus-plugin-dbml @wjmpantig/react-dbml-renderer @dbml/core @xyflow/react
```

Four packages, because three of them are peer dependencies of this plugin rather
than bundled copies — that way your site controls the versions, and there is only
ever one React and one React Flow in the bundle.

| Package | Range | Why |
| --- | --- | --- |
| `@wjmpantig/react-dbml-renderer` | `^2.0.0` | Draws the diagram |
| `@dbml/core` | `^10.1.1` | Parses the DBML |
| `@xyflow/react` | `^12.9.2` | The canvas the diagram is drawn on |
| `react` / `react-dom` | `^19.2.0` | Already in your Docusaurus site |

npm 7+ installs peer dependencies automatically, so the command above is belt and
braces. Under pnpm, or yarn with strict resolution, they must be listed
explicitly in your site's `package.json`.

:::info `@dbml/core` v10 is required
Renderer v2 needs `@dbml/core` v10 or newer. On v5 the optional and many-to-many
relationship operators, `inactive` refs, and table partials all fail to parse.
:::

## Wire it up

Add the remark plugin to `docusaurus.config.ts`:

```ts title="docusaurus.config.ts"
import type {Config} from '@docusaurus/types';
// highlight-next-line
import {remarkDbmlToComponent} from '@wjmpantig/docusaurus-plugin-dbml';

const config: Config = {
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // highlight-next-line
          remarkPlugins: [remarkDbmlToComponent],
        },
      },
    ],
  ],
  // highlight-next-line
  plugins: ['@wjmpantig/docusaurus-plugin-dbml'],
};

export default config;
```

Two things worth knowing about that snippet:

- **`remarkDbmlToComponent` is the part that does the work.** It is a named
  export, and it is registered **per content type** — the snippet above covers
  docs only. To cover the blog and standalone pages too, see
  [where to register it](./configuration.md#where-to-register-it).
- **The `plugins` entry is optional.** It is a no-op that returns nothing but a
  name. It is included here because people expect to install a Docusaurus plugin
  by listing it, and leaving it out changes nothing.

## Verify

Paste this into any docs page and restart the dev server:

````md
```dbml
Table users {
  id integer [pk, increment]
  name varchar
}
```
````

You should get a 500px-tall box with a **Preview** tab showing one table, and a
**Code** tab showing the DBML back to you. If you get an ordinary code block
instead, jump to [Troubleshooting](./troubleshooting.md).

Restarting matters: remark plugins run at build time, and changes to
`docusaurus.config.ts` are not hot-reloaded.

## No CSS to import

Every React Flow tutorial tells you to import a stylesheet. You do not need to
here — `DbmlDiagram` already imports both
`@wjmpantig/react-dbml-renderer/style.css` and `@xyflow/react/dist/style.css`
itself.

## TypeScript

Nothing to configure. The package ships its own declarations, and the
`./DbmlDiagram` subpath has its own types entry, so importing the component
directly is typed too.
