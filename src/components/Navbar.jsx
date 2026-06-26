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
        padding: '2rem 8vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 100,
        mixBlendMode: 'difference'
      }}
    >
      <div style={{ fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        SD.
      </div>

      <div style={{ display: 'flex', gap: '3rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        {['About', 'Projects', 'Contact'].map((item) => (
          <Magnetic key={item}>
            <a href={`#${item.toLowerCase()}`} style={{ display: 'inline-block', padding: '10px' }}>
              {item}
            </a>
          </Magnetic>
        ))}
      </div>
    </motion.nav>
  );
};

export default Navbar;
