import {DbmlRenderer} from "@wjmpantig/react-dbml-renderer";
import '@wjmpantig/react-dbml-renderer/style.css'
import '@xyflow/react/dist/style.css'
import { useState, useEffect } from "react";

export default function DbmlDiagram({ dbml }: { dbml: string }) {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      border: "1px solid var(--ifm-color-emphasis-300)",
      borderRadius: "var(--ifm-global-radius)",
      overflow: 'hidden',
      marginBottom: 'var(--ifm-spacing-vertical)',
    }}>
      <ul className="tabs" style={{ marginBottom: 0, padding: '0 var(--ifm-spacing-horizontal)' }}>
        <li
          className={`tabs__item ${tab === 'preview' ? 'tabs__item--active' : ''}`}
          onClick={() => setTab('preview')}
          style={{ cursor: 'pointer' }}
        >
          Preview
        </li>
        <li
          className={`tabs__item ${tab === 'code' ? 'tabs__item--active' : ''}`}
          onClick={() => setTab('code')}
          style={{ cursor: 'pointer' }}
        >
          Code
        </li>
      </ul>
      <div style={{ padding: 'var(--ifm-spacing-vertical) var(--ifm-spacing-horizontal)' }}>
        {tab === 'preview' && (
          <div style={{ height: 300 }}>
            {mounted && <DbmlRenderer content={dbml} />}
          </div>
        )}
        {tab === 'code' && (
          <pre style={{ marginBottom: 0, backgroundColor: 'transparent', border: 'none' }}>
            <code className="language-dbml">{dbml}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
