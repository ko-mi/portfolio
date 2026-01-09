'use client';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ValueSection from './components/ValueSection/ValueSection';
import ProblemsSection from './components/ProblemsSection/ProblemsSection';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <div className="systems-pattern" aria-hidden="true" />
      <Header />
      <main className="container">
        <Hero />
        <ValueSection />
        <ProblemsSection />
        <Footer />
      </main>
    </>
  );
}

export default App;


