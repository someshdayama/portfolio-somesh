import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './ui/Magnetic';
import MaskedText from './ui/MaskedText';

const Contact = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="contact" style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <motion.div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', scale, opacity }}>
        <h2 className="text-title font-serif" style={{ marginBottom: '2rem', textTransform: 'none' }}>
          <MaskedText>Let's Work Together</MaskedText>
        </h2>
        <Magnetic>
          <a href="mailto:someshdayama2@gmail.com" className="text-huge" style={{ display: 'inline-block', padding: '2rem' }}>
            Get In Touch
          </a>
        </Magnetic>
        
        <div style={{ marginTop: '4rem', display: 'flex', gap: '4rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <a href="https://www.linkedin.com/in/somesh-dayama/" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href="https://github.com/someshdayama" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href="tel:+917049614849">Phone ↗</a>
        </div>
        
        <div style={{ position: 'absolute', bottom: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Somesh Dayama. All rights reserved.
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
