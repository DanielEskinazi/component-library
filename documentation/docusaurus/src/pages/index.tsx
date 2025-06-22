import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', 'py-16 md:py-24')}>
      <div className="container">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {siteConfig.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          {siteConfig.tagline}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold no-underline transition-colors"
            to="/docs/getting-started/installation">
            Get Started
          </Link>
          <Link
            className="bg-transparent text-white border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold no-underline transition-colors"
            to="/docs/category/components">
            View Components
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Multi-Platform Component Library`}
      description="A comprehensive component library for web and mobile platforms with multiple styling options">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}