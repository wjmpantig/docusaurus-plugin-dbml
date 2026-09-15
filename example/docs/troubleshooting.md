---
sidebar_position: 7
---

# Troubleshooting

## My dbml block renders as an ordinary code block

The remark plugin is not running for that file. Remark plugins are registered per
content type, so the usual cause is that it is wired under `docs` while the file
is a blog post or a page. Add it to that content type too — see
[where to register it](./configuration.md#where-to-register-it).

If it is registered for that content type and still not firing, check the fence
itself. The
language must be exactly `dbml`; `sql` and `dbdiagram` do not match. The meta
string goes after the language, not instead of it:

````md
```dbml height=600
```
````

Last possibility: you imported the default export. `import plugin from
'@wjmpantig/docusaurus-plugin-dbml'` is the no-op stub — you want the named
`remarkDbmlToComponent`.

## My config change did nothing

Remark plugins run at build time, and `docusaurus.config.ts` is not hot-reloaded
for plugin options. Stop and restart `npm start`.

## `Cannot find module '.../DbmlDiagram'`

The import is injected for you, so this means the package is not resolvable from
your site — not installed, or linked to a build that does not exist. If you are
developing against a local checkout, build the plugin before building the site;
the injected import resolves to `dist/`, which only exists after a build.

## `Cannot find module '@wjmpantig/react-dbml-renderer'` or `@xyflow/react`

Peer dependencies are missing. Install all four packages — see
[Installation](./installation.md).

## The diagram is empty, or the parser throws

The renderer surfaces `@dbml/core` parse errors. Paste the schema into
[dbdiagram.io](https://dbdiagram.io/) to check the syntax first.

If it parses there but not here, it may be something the renderer does not draw:

- `records` / Data Sample blocks
- custom metadata, such as `[owner: "team"]` or `Metadata` blocks
- `DiagramView`
- the module system — `use` and `reuse`. Following imports needs a resolver, and
  the plugin hands the renderer a single string.

## Operators like `>?` or `[inactive]` fail to parse

Your `@dbml/core` is too old. Renderer v2 needs v10 or newer; on v5 the optional
(`>?`, `?>`, `-?`, `<>?`) operators, `inactive` refs and table partials are all
unrecognised.

## The diagram is squashed or cut off

The container is exactly `height` tall with `overflow: hidden`, and there is no
auto-height. Give that fence more room:

````md
```dbml height=800
```
````

Or raise the default globally with the `height` option.

## Backticks or `$` in my DBML

Both are safe. The transform escapes them when it builds the template literal, so
`` default: `now()` `` and a `$` inside a note survive intact.

## Scrolling the page zooms the diagram

That is React Flow's wheel handling inside the canvas. Scroll with the pointer
outside the diagram.

## Nothing renders in the static HTML

By design. The diagram is wrapped in `@docusaurus/BrowserOnly`, so it is
client-only; what gets pre-rendered is the **Code** tab, which is also what search
indexes. If you are seeing an SSR error mentioning `window`, it is coming from
your own code rather than this component.

## Known limitations

- No `colorMode` passthrough — the renderer follows the site theme.
- No control over tab labels, the default tab, or hiding the Code tab.
- No width option, no auto-height.

For anything past these, import the component directly — see
[Standalone usage](./standalone.md).
