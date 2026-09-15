import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
// Imported directly rather than written as a fence: remark does not transform
// .tsx, so this doubles as the live proof that the subpath export works.
import DbmlDiagram from '@wjmpantig/docusaurus-plugin-dbml/DbmlDiagram';

import styles from './index.module.css';

const schema = `Table users {
  id    bigint       [pk, increment]
  email varchar(254) [not null, unique]
}

Table posts {
  id        bigint       [pk, increment]
  author_id bigint       [not null, ref: > users.id]
  title     varchar(200) [not null]
  status    post_status  [not null, default: 'DRAFT']
}

Enum post_status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
`;

const fence = ['```dbml', schema.trimEnd(), '```'].join('\n');

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Get started
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/examples">
            Live examples
          </Link>
        </div>
      </div>
    </header>
  );
}

function Demo() {
  return (
    <section className="container margin-vert--xl">
      <div className="row">
        <div className="col col--5">
          <Heading as="h2">Write this</Heading>
          <CodeBlock language="markdown">{fence}</CodeBlock>
        </div>
        <div className="col col--7">
          <Heading as="h2">Get this</Heading>
          <DbmlDiagram dbml={schema} height={460} />
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Render DBML schemas as interactive diagrams in Docusaurus.">
      <HomepageHeader />
      <main>
        <Demo />
      </main>
    </Layout>
  );
}
