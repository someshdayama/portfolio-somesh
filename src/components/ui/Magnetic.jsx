import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const Magnetic = ({ children }) => {
  const ref = useRef(null);

  // Motion values for direct DOM updates without React re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring configuration for smooth tracking and recovery
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.35);
    y.set(middleY * 0.35);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ position: 'relative', x: springX, y: springY }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;

