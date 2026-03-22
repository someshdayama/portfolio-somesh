import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './ui/Magnetic';

const Navbar = () => {
  const [activeSegment, setActiveSegment] = useState('home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'education'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 200;
        }
        return false;
      });
      if (current) setActiveSegment(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Lab' },
    { id: 'experience', label: 'History' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, x: '-50%' }}
      animate={{ y: 0, x: '-50%' }}
      className="glass"
      style={{
        position: 'fixed',
        top: '2rem',
        left: '50%',
        zIndex: 1000,
        padding: '0.5rem 1rem',
        borderRadius: '100px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: scrolled ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
        transition: 'all 0.4s ease'
      }}
    >
      <Magnetic>
        <a href="#hero" style={{ padding: '0.75rem 1.25rem', fontWeight: 900, fontSize: '1.2rem'}} className="accent-text">SD</a>
      </Magnetic>
      
      <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1rem' }}>
        {navItems.map((item) => (
          <Magnetic key={item.id}>
            <a 
              href={`#${item.id}`}
              style={{
                padding: '0.75rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: activeSegment === item.id ? 'white' : 'var(--text-secondary)',
                position: 'relative',
                display: 'block'
              }}
            >
              {item.label}
              {activeSegment === item.id && (
                <motion.div
                  layoutId="nav-bg"
                  className="accent-primary"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '50px',
                    zIndex: -1,
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                  }}
                />
              )}
            </a>
          </Magnetic>
        ))}
      </div>

      <Magnetic>
        <a href="#contact" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
          Connect
        </a>
      </Magnetic>
    </motion.nav>
  );
};

export default Navbar;
