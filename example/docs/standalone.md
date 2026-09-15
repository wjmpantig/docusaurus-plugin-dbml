---
sidebar_position: 4
---

# Standalone usage

The code fence is the convenient path, not the only one. Both components are
ordinary React components you can import and render yourself.

Reach for this when the DBML does not live in your Markdown: it comes from a
variable, a separate `.dbml` file, an API, or you want the diagram inside a
layout a fence cannot express.

## `DbmlDiagram` outside a fence

This is exactly what the remark transform renders, available as a public subpath
export:

```tsx
import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';
```

| Prop | Type | Default |
| --- | --- | --- |
| `dbml` | `string` | required |
| `height` | `number \| string` | `500` |

It is a default export and memoized, so re-renders of the surrounding page do not
re-parse the schema.

### In an MDX page

Remark rewrites fences, so inside `.mdx` you can mix both approaches — a fence
where the schema is literal, the component where it is not:

```mdx
import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';

export const schema = `
Table users {
  id integer [pk, increment]
  email varchar(254) [not null, unique]
}
`;

<DbmlDiagram dbml={schema} height={320} />
```

### In a React page or component

The remark transform never touches `.tsx` — this direct import is the reason the
subpath export exists:

```tsx title="src/pages/schema.tsx"
import Layout from '@theme/Layout';
import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';

const schema = `
Table users {
  id integer [pk, increment]
  name varchar
}
`;

export default function SchemaPage() {
  return (
    <Layout title="Schema">
      <DbmlDiagram dbml={schema} height="70vh" />
    </Layout>
  );
}
```

The [home page of this site](/) is a working instance of exactly this — a live
`DbmlDiagram` imported into a `.tsx` page, not a fence.

### From a file

Keep the schema as a real `.dbml` file that your database tooling can also read,
and let webpack inline it:

```tsx
import schema from '!!raw-loader!./schema.dbml';

<DbmlDiagram dbml={schema} height={600} />;
```

### From an API

`DbmlDiagram` wraps its diagram in `@docusaurus/BrowserOnly`, so it is safe to
render during SSR without any guard of your own — the server renders the tabs,
the browser renders the diagram. Your own fetching still needs the usual
client-side care:

```tsx
import {useEffect, useState} from 'react';
import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';

export default function LiveSchema() {
  const [dbml, setDbml] = useState<string>();

  useEffect(() => {
    fetch('/api/schema.dbml')
      .then((r) => r.text())
      .then(setDbml);
  }, []);

  if (!dbml) return <p>Loading schema…</p>;
  return <DbmlDiagram dbml={dbml} height={600} />;
}
```

## `DbmlRenderer` without Docusaurus

`DbmlDiagram` is a thin wrapper. Underneath is
[`@wjmpantig/react-dbml-renderer`](https://github.com/wjmpantig/react-dbml-renderer),
a plain React library with no Docusaurus dependency — usable in Vite, Next.js, or
any React app:

```tsx title="App.tsx"
import {DbmlRenderer} from '@wjmpantig/react-dbml-renderer';
import '@wjmpantig/react-dbml-renderer/style.css';
import '@xyflow/react/dist/style.css';

const schema = `
Table users {
  id integer [pk, increment]
  email varchar(254) [not null, unique]
}
`;

export default function App() {
  return (
    <div style={{height: '100vh'}}>
      <DbmlRenderer content={schema} colorMode="system" />
    </div>
  );
}
```

| Prop | Type | Default |
| --- | --- | --- |
| `content` | `string` | required |
| `colorMode` | `'light' \| 'dark' \| 'system'` | `'system'` |

Two differences from the Docusaurus component:

- **You import the stylesheets yourself.** `DbmlDiagram` does it for you; the
  renderer does not.
- **You own the height.** `DbmlRenderer` fills its container, so the container
  needs a height or you get a zero-height diagram.

## What this plugin adds

Set against using the renderer directly, the plugin contributes:

- the Markdown transform, so a fence becomes a diagram
- the Preview/Code tab pair, which keeps the DBML copyable and indexable
- the stylesheet imports and the `BrowserOnly` SSR guard
- the `height` container, global and per-fence

If you want none of those, use `DbmlRenderer` and skip this plugin entirely.
