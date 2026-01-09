'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ValueSection from './components/ValueSection/ValueSection';
import ProblemsSection from './components/ProblemsSection/ProblemsSection';
import Footer from './components/Footer/Footer';
import type { ProblemCard } from './types';
import { fetchProjects } from './services/strapi';
import { defaultProblems } from './content/defaultProblems';
 

function App() {
  const [problems, setProblems] = useState<ProblemCard[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const projects = await fetchProjects();
        const adapted: ProblemCard[] = projects.map((p) => ({
          // stable key for illustrations: use sortOrder (your chosen strategy)
          id: String(p.sortOrder ?? p.id),
          title: p.title,
          tabLabel: p.tabLabel,
          description: p.description ?? '',
          problem: p.problem,
          solution: p.solution,
          result: p.result,
          techStack: p.techStack,
        }));
        if (!cancelled) setProblems(adapted);
      } catch {
        // graceful fallback: keep UX stable if CMS is down/misconfigured
        if (!cancelled) setProblems(defaultProblems);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <>
      <div className="systems-pattern" aria-hidden="true" />
      <Header />
      <main className="container">
        <Hero />
        <ValueSection />
        <ProblemsSection problems={problems ?? defaultProblems} />
        <Footer />
      </main>
    </>
  );
}

export default App;


