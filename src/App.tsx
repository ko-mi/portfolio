'use client';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ValueSection from './components/ValueSection/ValueSection';
import ProblemsSection from './components/ProblemsSection/ProblemsSection';
import Footer from './components/Footer/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { ProblemCard } from './types';
import { defaultProblems } from './content/defaultProblems';

interface AppProps {
  problems?: ProblemCard[];
}

/**
 * Main App component - receives problems from server-side rendering.
 * No client-side fetching, no useEffect needed.
 * Falls back to defaultProblems if none provided.
 * Wrapped in ErrorBoundary for graceful error handling.
 */
function App({ problems = defaultProblems }: AppProps) {
  return (
    <>
      <div className="systems-pattern" aria-hidden="true" />
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <main className="container">
        <ErrorBoundary>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary>
          <ValueSection />
        </ErrorBoundary>
        <ErrorBoundary
          fallback={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Unable to load projects. Showing default content.</p>
            </div>
          }
        >
          <ProblemsSection problems={problems} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Footer />
        </ErrorBoundary>
      </main>
    </>
  );
}

export default App;


