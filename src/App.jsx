import React, { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import StarryBackground from './components/ui/StarryBackground';
import ScrollProgress from './components/ui/ScrollProgress';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        lenis.scrollTo(target.getAttribute('href'));
      }
    };
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <StarryBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
      <footer id="contact" style={{ position: 'relative', height: '100vh', clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}>
        <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '100vh' }}>
          <Contact />
        </div>
      </footer>
    </div>
  );
}

export default App;
