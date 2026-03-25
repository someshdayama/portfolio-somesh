import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import BentoSkills from './components/BentoSkills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';

function App() {
  return (
    <div className="app-container">
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
      `}} />
    </div>
  );
}

export default App;
