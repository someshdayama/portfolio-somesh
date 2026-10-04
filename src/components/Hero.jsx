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
    <section ref={containerRef} id="hero">
      <motion.div className="hero-copy" style={{ y, opacity }}>
        <h1 className="text-huge">
          <MaskedText delay={0.0} useAnimate>Somesh</MaskedText><br />
          <MaskedText delay={0.15} className="font-serif" useAnimate>Dayama</MaskedText>
        </h1>

        <motion.p
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="text-body hero-summary"
          style={{ 
            margin: '2.5rem auto 0', 
            fontSize: 'clamp(1rem, 1.4vw, 1.25rem)', 
            maxWidth: '36rem',
            lineHeight: 1.55,
            textWrap: 'balance'
          }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              variants={wordVars}
              style={{ display: 'inline-block', marginRight: i === words.length - 1 ? 0 : '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>

      </motion.div>

      <div className="hero-bridge" aria-hidden="true" />

      <motion.div
        className="hero-scroll"
        style={{ opacity }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Scroll</span>
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

