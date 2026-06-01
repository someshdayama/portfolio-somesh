import React, { useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const HoverImage = ({ src, isActive }) => {
  const cursorX = useSpring(0, { damping: 25, stiffness: 200 });
  const cursorY = useSpring(0, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 300,
        height: 200,
        pointerEvents: 'none',
        zIndex: 99,
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        overflow: 'hidden',
        backgroundColor: '#111'
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
    >
      {src && (
        <img 
          src={src} 
          alt="Hover Reveal" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} 
        />
      )}
    </motion.div>
  );
};

export default HoverImage;
