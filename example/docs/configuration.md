---
sidebar_position: 3
---

# Configuration

There is one option. The rest of this page is about where to put it and what the
package's two exports actually do.

## Options

| Option | Type | Default | Effect |
| --- | --- | --- | --- |
| `height` | `number \| string` | `500` | Height of the Preview tab |

A **number** is emitted as a JSX numeric literal, so React renders it as pixels.
A **string** is passed through to CSS verbatim, so any CSS length works.

```ts title="docusaurus.config.ts"
docs: {
  remarkPlugins: [[remarkDbmlToComponent, {height: 420}]],
},
```

```ts
// pixels
remarkPlugins: [[remarkDbmlToComponent, {height: 420}]]

// any CSS length
remarkPlugins: [[remarkDbmlToComponent, {height: '50vh'}]]
```

There is no width option — the diagram is always full width.

## Per-fence override

Set the height for one diagram with the code fence meta string:

````md
```dbml height=600
Table users {
  id integer [pk]
}
```
````

The fence always wins over the global option. The parsing is worth stating
exactly, because it has sharp edges:

- The meta is matched with `/height=(\S+)/`, so **the value cannot contain
  spaces**. `height=calc(100vh - 64px)` captures only `calc(100vh`. Write
  `height=calc(100vh-64px)` instead.
- The captured value goes through `Number()`. If it parses as a number, it is
  pixels; otherwise it is used as a raw CSS string. So `height=600` is 600px and
  `height=50vh` is `50vh`.
- `height=` is the only key read. Anything else in the meta string is ignored —
  there is no `title=` and no line highlighting, because the fence is no longer a
  code block by the time Docusaurus would handle those.

## Where to register it {#where-to-register-it}

Remark plugins in Docusaurus are registered **per content type**. There is no
global `markdown.remarkPlugins` field — `markdown` holds `mermaid`, `format`,
`hooks` and friends, and adding `remarkPlugins` there fails config validation.

So register it once per content type you want covered:

| Placement | Covers |
| --- | --- |
| `presets[0][1].docs.remarkPlugins` | docs |
| `presets[0][1].blog.remarkPlugins` | blog posts |
| `presets[0][1].pages.remarkPlugins` | `src/pages/*.md(x)` |

**Register it everywhere you write Markdown.** The transform only rewrites code
nodes whose language is `dbml`, and only injects its import when it finds one, so
on every other file it costs nothing. Leaving a content type out costs you a
confusing failure instead: a dbml fence in a blog post silently renders as a
plain code block, with no error to search for.

This site registers it under both `docs` and `pages`:

```ts title="docusaurus.config.ts"
presets: [
  [
    'classic',
    {
      docs: {
        sidebarPath: './sidebars.ts',
        remarkPlugins: [remarkDbmlToComponent],
      },
      pages: {
        remarkPlugins: [remarkDbmlToComponent],
      },
    },
  ],
],
```

Registering per content type also means you can give each one a **different
`height`** — the option binds at registration.

`.tsx` pages are never touched by remark. Import the component directly there;
see [Standalone usage](./standalone.md).

## The two exports

```ts
import plugin, {remarkDbmlToComponent} from '@wjmpantig/docusaurus-plugin-dbml';
```

- **`remarkDbmlToComponent`** (named) — the remark transform. This is the one
  that matters.
- **`plugin`** (default) — a Docusaurus plugin that returns
  `{name: 'docusaurus-plugin-dbml'}` and nothing else. No lifecycle hooks, no
  theme path, no webpack config.

:::warning The default export is the no-op
`import plugin from '@wjmpantig/docusaurus-plugin-dbml'` gives you the stub, not
the remark plugin. If diagrams are not rendering, check that you imported the
**named** `remarkDbmlToComponent`.
:::

## Coexisting with Mermaid

They are independent. `markdown.mermaid` plus `@docusaurus/theme-mermaid` handles
` ```mermaid ` fences; `remarkDbmlToComponent` only ever touches ` ```dbml `
fences. This site runs both.

## Not configurable (yet)

Stated plainly, since it doubles as the roadmap:

- No `colorMode` passthrough. The renderer defaults to `"system"`, which follows
  the Docusaurus theme toggle — usually what you want anyway.
- No control over the tab labels, and no way to make **Code** the default tab or
  to hide it.
- No width option; the diagram fills its container.
- No auto-height. The container is exactly `height` tall with `overflow: hidden`,
  so a large schema needs a larger `height`.

If you need more control than this, import the component yourself — see
[Standalone usage](./standalone.md).
