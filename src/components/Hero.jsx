import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskedText from './ui/MaskedText';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={containerRef}
      id="hero"
      style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div className="grain-overlay"></div>
      
      <motion.div 
        style={{ y, opacity, textAlign: 'center', zIndex: 10 }}
      >
        <h1 className="text-huge">
          <MaskedText delay={0.1}>Somesh</MaskedText><br />
          <MaskedText delay={0.3} className="font-serif">Dayama</MaskedText>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-body" 
          style={{ margin: '3rem auto 0', fontSize: '1.2rem', maxWidth: '500px' }}
        >
          Results-driven Software Engineer & SRE. Architecting high-performance CI/CD automation across GCP, Azure, and AWS.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default Hero;
