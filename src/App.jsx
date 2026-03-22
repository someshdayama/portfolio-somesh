import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import BentoSkills from './components/BentoSkills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import CustomCursor from './components/ui/CustomCursor';

function App() {
  return (
    <div className="app-container">
      <CustomCursor />
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <BentoSkills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .app-container {
          overflow-x: hidden;
          background-color: var(--bg-primary);
        }
        main {
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}} />
    </div>
  );
}

export default App;
