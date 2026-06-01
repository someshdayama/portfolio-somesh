import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from './ui/Magnetic';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '2rem 5vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 100,
        mixBlendMode: 'difference'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        Somesh <br />
        <span className="font-serif" style={{ fontWeight: 400 }}>Dayama</span>
      </div>

      <ul style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        <li><Magnetic><a href="#work" style={{ display: 'inline-block', padding: '10px' }}>Work</a></Magnetic></li>
        <li><Magnetic><a href="#about" style={{ display: 'inline-block', padding: '10px' }}>About</a></Magnetic></li>
        <li><Magnetic><a href="#contact" style={{ display: 'inline-block', padding: '10px' }}>Contact</a></Magnetic></li>
      </ul>
    </motion.nav>
  );
};

export default Navbar;
