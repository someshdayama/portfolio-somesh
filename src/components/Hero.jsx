import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Split summary into words for staggered fade-in
  const words = PROFILE.hero.summary.split(" ");

  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.35,
      }
    }
  };

  const wordVars = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.2, 0.65, 0.3, 0.9] } 
    }
  };

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
      <motion.div
        style={{ y, opacity, textAlign: 'center', zIndex: 10 }}
      >
        <h1 className="text-huge">
          <MaskedText delay={0.0} useAnimate>Somesh</MaskedText><br />
          <MaskedText delay={0.15} className="font-serif" useAnimate>Dayama</MaskedText>
        </h1>

        <motion.p
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="text-body"
          style={{ 
            margin: '3rem auto 0', 
            fontSize: '1.2rem', 
            maxWidth: '500px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.3em'
          }}
        >
          {words.map((word, i) => (
            <motion.span key={i} variants={wordVars} style={{ display: 'inline-block' }}>
              {word}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          opacity,
          zIndex: 10
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <span style={{ fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Scroll</span>
        <div style={{ 
          width: '20px', 
          height: '32px', 
          borderRadius: '10px', 
          border: '2px solid rgba(255, 255, 255, 0.3)', 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '4px' 
        }}>
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              width: '4px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#ffffff'
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
