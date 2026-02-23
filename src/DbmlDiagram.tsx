import { DbmlRenderer } from "@wjmpantig/react-dbml-renderer";
import '@wjmpantig/react-dbml-renderer/style.css';
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from "react";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function DbmlDiagram({ dbml }: { dbml: string }) {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  return (
    <Tabs>
      <TabItem value="preview" label="Preview" default>
        <div style={{ height: 300 }}>
          {mounted && <DbmlRenderer content={dbml} />}
        </div>
      </TabItem>
      <TabItem value="code" label="Code">
        <pre style={{ marginBottom: 0, backgroundColor: 'transparent', border: 'none' }}>
          <code className="language-dbml">{dbml}</code>
        </pre>
      </TabItem>
    </Tabs>
  );
}
