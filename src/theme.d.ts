declare module '@docusaurus/BrowserOnly' {
  import type { ReactNode } from 'react';
  export interface BrowserOnlyProps {
    children: () => ReactNode;
    fallback?: ReactNode;
  }
  export default function BrowserOnly(props: BrowserOnlyProps): JSX.Element;
}

declare module '@theme/CodeBlock' {
  import type { ReactNode } from 'react';
  export interface CodeBlockProps {
    children: ReactNode;
    language?: string;
    title?: string;
    showLineNumbers?: boolean;
  }
  export default function CodeBlock(props: CodeBlockProps): JSX.Element;
}

declare module '@theme/Tabs' {
  import type { ReactNode } from 'react';
  export interface TabsProps {
    children: ReactNode;
    defaultValue?: string;
    groupId?: string;
  }
  export default function Tabs(props: TabsProps): JSX.Element;
}

declare module '@theme/TabItem' {
  import type { ReactNode } from 'react';
  export interface TabItemProps {
    value: string;
    label?: string;
    default?: boolean;
    children: ReactNode;
  }
  export default function TabItem(props: TabItemProps): JSX.Element;
}
