import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div style={{ position: 'fixed', right: '10px', top: '20vh', bottom: '20vh', width: '2px', backgroundColor: 'rgba(255, 255, 255, 0.1)', zIndex: 1000, pointerEvents: 'none', borderRadius: '1px', overflow: 'hidden' }}>
      <motion.div style={{ scaleY, transformOrigin: 'top', width: '100%', height: '100%', backgroundColor: '#fff' }} />
    </div>
  );
};

export default ScrollProgress;
