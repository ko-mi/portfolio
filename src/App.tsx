'use client';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ValueSection from './components/ValueSection/ValueSection';
import ProblemsSection from './components/ProblemsSection/ProblemsSection';
import Footer from './components/Footer/Footer';
import type { ProblemCard } from './types';
import { defaultProblems } from './content/defaultProblems';

interface AppProps {
  problems?: ProblemCard[];
}

/**
 * Main App component - now receives problems from server-side rendering.
 * No client-side fetching, no useEffect needed.
 * Falls back to defaultProblems if none provided.
 */
function App({ problems = defaultProblems }: AppProps) {
  return (
    <>
      <div className="systems-pattern" aria-hidden="true" />
      <Header />
      <main className="container">
        <Hero />
        <ValueSection />
        <ProblemsSection problems={problems} />
        <Footer />
      </main>
    </>
  );
}

export default App;


