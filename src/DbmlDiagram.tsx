import { DbmlRenderer } from "@wjmpantig/react-dbml-renderer";
import '@wjmpantig/react-dbml-renderer/style.css';
import '@xyflow/react/dist/style.css';
import { memo } from "react";
import BrowserOnly from '@docusaurus/BrowserOnly';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

function DbmlDiagram({ dbml, height = 500 }: { dbml: string; height?: number | string }) {

  return (
    <Tabs>
      <TabItem value="preview" label="Preview" default>
        <div style={{ height, width: '100%', overflow: 'hidden' }}>
          <BrowserOnly>
            {() => <DbmlRenderer content={dbml} />}
          </BrowserOnly>
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

export default memo(DbmlDiagram);
