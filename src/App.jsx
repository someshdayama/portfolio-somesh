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

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);
    
    // Smooth scroll for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a');
      if (target && target.getAttribute('href')?.startsWith('#')) {
        const href = target.getAttribute('href');
        if (href.length > 1) {
          e.preventDefault();
          lenis.scrollTo(href, { offset: -88 });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="app-container">
      <div className="grain-overlay" />
      <StarryBackground />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
      </main>
      <footer 
        style={{ 
          position: 'relative', 
          minHeight: '100vh', 
          clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)',
          transform: 'translateZ(0)',
          willChange: 'clip-path'
        }}
      >
        <div 
          style={{ 
            position: 'relative', 
            width: '100%', 
            minHeight: '100vh',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          }}
        >
          <Contact />
        </div>
      </footer>
    </div>
  );
}

export default App;

