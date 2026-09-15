---
sidebar_position: 1
---

# Introduction

`@wjmpantig/docusaurus-plugin-dbml` renders [DBML](https://dbml.dbdiagram.io/docs/)
schemas as interactive diagrams in your Docusaurus site.

It is a [remark](https://github.com/remarkjs/remark) plugin. You write a fenced
code block tagged `dbml`, and it becomes a diagram. Your source stays a plain
code block — no MDX imports, no components in your prose, nothing to remember.

## See it

```dbml
Table users {
  id integer [pk, increment]
  email varchar(254) [not null, unique]
  name varchar
}

Table posts {
  id        integer [pk, increment]
  author_id integer [not null, ref: > users.id]
  title     varchar(200) [not null]
}
```

That diagram is a dbml fence in this page's source. Click **Code** on it to see
the DBML that produced it — the tabs are part of what the plugin renders.

## How it works

1. The remark transform visits every code node whose language is `dbml`
   (case-insensitive, trimmed).
2. It replaces the node with `<DbmlDiagram dbml={...} height={...} />`.
3. If the file contained at least one such fence, it prepends
   `import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram'`.
   Files without a dbml fence are left untouched.
4. `DbmlDiagram` renders a Docusaurus `<Tabs>`: a **Preview** tab holding the
   diagram, and a **Code** tab holding the raw DBML in a `<CodeBlock>`.

Keeping the Code tab matters — the DBML stays copyable, and it is what ends up in
the pre-rendered HTML for search indexing, since the diagram itself is
client-only.

## What draws the diagram

Two packages, with a clean split:

- **This plugin** owns the Markdown → component transform.
- **[`@wjmpantig/react-dbml-renderer`](https://github.com/wjmpantig/react-dbml-renderer)**
  owns the drawing and the interaction — layout, panning, zoom, and
  hover-to-highlight of related columns. It parses with `@dbml/core` and renders
  with [React Flow](https://reactflow.dev/).

You can use either one on its own; see [Standalone usage](./standalone.md).

## Next

- [Installation](./installation.md) — the four packages and the config wiring
- [Configuration](./configuration.md) — the `height` option, global and per-fence
- [Examples](./examples.md) — a live diagram per DBML feature
