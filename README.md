# Docusaurus Dbml Renderer Plugin

This plugin allows you to render Dbml diagrams in your Docusaurus site.

![Docusaurus Dbml Renderer Preview](./assets/preview.gif)

## Installation

```bash
npm install @wjmpantig/docusaurus-plugin-dbml @wjmpantig/react-dbml-renderer @dbml/core @xyflow/react
```

## Usage

```js
// docusaurus.config.ts

import { remarkDbmlToComponent } from '@wjmpantig/docusaurus-plugin-dbml';

export default function config() {
  return {
    plugins: [
      ['@wjmpantig/docusaurus-plugin-dbml'], //add me
    ],
    docs: {
      remarkPlugins: [remarkDbmlToComponent], // add me
    },
  };
}
```

## Options

### Preview height

The default preview height is `500px`. You can change it globally by passing options to `remarkDbmlToComponent`:

```js
docs: {
  remarkPlugins: [[remarkDbmlToComponent, { height: 400 }]],
}
```

You can also override the height per diagram using the code fence meta string:

````md
```dbml height=600
Table users {
  id integer [primary key]
  name varchar
}
```
````

Both numbers (interpreted as `px`) and CSS string values are accepted:

```js
// numbers
remarkPlugins: [[remarkDbmlToComponent, { height: 400 }]]

// CSS strings
remarkPlugins: [[remarkDbmlToComponent, { height: '50vh' }]]
```

````md
```dbml height=50vh
...
```
````
