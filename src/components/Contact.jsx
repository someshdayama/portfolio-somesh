import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Magnetic from './ui/Magnetic';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const Contact = () => {
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVars = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section ref={ref} id="contact" style={{ backgroundColor: 'transparent', overflow: 'hidden' }}>
      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ margin: "-50px" }}
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          scale, 
          opacity 
        }}
      >
        <motion.h2 
          variants={itemVars}
          className="text-title font-serif" 
          style={{ marginBottom: '2.5rem', textTransform: 'none' }}
        >
          <MaskedText>Let's Work Together</MaskedText>
        </motion.h2>

        <motion.div variants={itemVars}>
          <Magnetic>
            <a href={`mailto:${PROFILE.contact.email}`} className="text-huge" style={{ display: 'inline-block', padding: '1.5rem 3rem' }}>
              Get In Touch
            </a>
          </Magnetic>
        </motion.div>

        <motion.div 
          variants={itemVars}
          onClick={handleCopy} 
          style={{ 
            marginTop: '1.5rem', 
            cursor: 'pointer', 
            fontSize: '1.15rem', 
            color: copied ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 500,
            letterSpacing: '0.05em',
            transition: 'color 0.3s ease'
          }}
          onMouseEnter={(e) => { if (!copied) e.target.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { if (!copied) e.target.style.color = 'var(--text-secondary)'; }}
        >
          {copied ? '✓ Email Copied to Clipboard!' : PROFILE.contact.email}
        </motion.div>
        
        <motion.div 
          variants={itemVars}
          style={{ 
            marginTop: '4rem', 
            display: 'flex', 
            gap: '2rem', 
            fontSize: '0.9rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {PROFILE.contact.socials.map((social, i) => (
            <Magnetic key={i}>
              <a href={social.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '10px' }}>
                {social.name} ↗
              </a>
            </Magnetic>
          ))}
          <Magnetic>
            <a href={`tel:${PROFILE.contact.phone}`} style={{ display: 'inline-block', padding: '10px' }}>
              Phone ↗
            </a>
          </Magnetic>
        </motion.div>
        
        <motion.div 
          variants={itemVars}
          style={{ position: 'absolute', bottom: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} Somesh Dayama. All rights reserved.
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;

