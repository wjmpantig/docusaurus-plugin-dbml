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
