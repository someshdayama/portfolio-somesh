import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollProgress = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const y = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  const handleScrollTo = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const height = rect.height;
    const percentage = Math.max(0, Math.min(1, clickY / height));
    
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: percentage * scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div 
      ref={containerRef}
      onClick={handleScrollTo}
      whileHover="hover"
      className="scroll-progress"
      style={{ 
        position: 'fixed', 
        right: '12px', 
        top: '25vh', 
        bottom: '25vh', 
        width: '20px', // Wide hover zone for easy cursor interaction
        zIndex: 1000, 
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: 'transparent'
      }}
    >
      {/* Background Track line */}
      <div style={{ 
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '10px',
        pointerEvents: 'none'
      }} />

      {/* The main progress bar */}
      <motion.div 
        variants={{
          hover: { width: '4px' }
        }}
        style={{ 
          scaleY, 
          transformOrigin: 'top', 
          width: '2px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,1) 100%)',
          borderRadius: '10px',
          pointerEvents: 'none',
          transition: { duration: 0.2 }
        }} 
      />

      {/* A glowing dot trailing at the tip of progress */}
      <motion.div 
        variants={{
          hover: { scale: 1.3 }
        }}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 'calc(50% - 4px)',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          boxShadow: '0 0 10px #ffffff, 0 0 20px #ffffff',
          y,
          translateY: '-50%',
          pointerEvents: 'none',
          transition: { duration: 0.2 }
        }} 
      />
    </motion.div>
  );
};

export default ScrollProgress;


