import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from './ui/Magnetic';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="navbar-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: '1.5rem 6vw',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 100,
          mixBlendMode: mobileMenuOpen ? 'normal' : 'difference'
        }}
      >
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <a 
            href="#hero" 
            style={{ 
              fontWeight: 800, 
              fontSize: '1.5rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              color: '#ffffff' 
            }}
          >
            SD.
          </a>
        </div>

        {/* Desktop Links */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
          {navLinks.map((item) => (
            <Magnetic key={item.name}>
              <a href={item.href} style={{ display: 'inline-block', padding: '8px 4px', color: '#ffffff' }}>
                {item.name}
              </a>
            </Magnetic>
          ))}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            zIndex: 110
          }}
        >
          <motion.span 
            animate={mobileMenuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#ffffff', display: 'block', transformOrigin: 'center' }} 
          />
          <motion.span 
            animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#ffffff', display: 'block' }} 
          />
          <motion.span 
            animate={mobileMenuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            style={{ width: '24px', height: '2px', backgroundColor: '#ffffff', display: 'block', transformOrigin: 'center' }} 
          />
        </button>
      </motion.nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(5, 5, 12, 0.96)',
              backdropFilter: 'blur(20px)',
              zIndex: 99,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2.5rem',
              padding: '2rem'
            }}
          >
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#ffffff'
                }}
              >
                {item.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;


