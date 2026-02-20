declare module '@theme-original/MDXComponents' {
  import type { ComponentProps } from 'react';

  type MDXComponentsObject = Record<string, React.ComponentType<ComponentProps<never>>>;
  const MDXComponents: MDXComponentsObject;
  export default MDXComponents;
}
