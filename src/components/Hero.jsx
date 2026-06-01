import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

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
      id="about"
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
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-huge">
          Somesh <br />
          <span className="font-serif">Dayama</span>
        </h1>
        
        <p className="text-body" style={{ margin: '3rem auto 0', fontSize: '1.2rem', maxWidth: '500px' }}>
          Results-driven Software Engineer & SRE. Architecting high-performance CI/CD automation across GCP, Azure, and AWS.
        </p>
      </motion.div>
    </section>
  );
};

export default Hero;
