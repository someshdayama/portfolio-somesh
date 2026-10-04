import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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

  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
    <section ref={ref} id="contact" style={{ backgroundColor: 'transparent', overflow: 'hidden', padding: '4rem 4vw' }}>
      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ margin: "-50px" }}
        style={{ 
          minHeight: '85vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center', 
          scale, 
          opacity,
          position: 'relative'
        }}
      >
        <motion.h2 
          variants={itemVars}
          className="text-title font-serif" 
          style={{ marginBottom: '2rem', textTransform: 'none' }}
        >
          <MaskedText>Let's Work Together</MaskedText>
        </motion.h2>

        <motion.div variants={itemVars}>
          <Magnetic>
            <a 
              href={`mailto:${PROFILE.contact.email}`} 
              className="text-huge contact-email-cta" 
              style={{ display: 'inline-block', padding: '1rem 2rem' }}
            >
              Get In Touch
            </a>
          </Magnetic>
        </motion.div>

        {/* Email button with copy to clipboard functionality */}
        <motion.div 
          variants={itemVars}
          onClick={handleCopy}
          className="copy-email"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCopy();
            }
          }}
          style={{ color: copied ? '#34d399' : 'var(--text-secondary)' }}
        >
          <span className="email-address">{PROFILE.contact.email}</span>
          <span className="copy-hint" aria-live="polite">{copied ? 'Copied' : 'Click to copy'}</span>
        </motion.div>

        {/* Toast confirmation */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: '1rem',
                padding: '0.4rem 1rem',
                borderRadius: '20px',
                backgroundColor: '#34d399',
                color: '#000000',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                boxShadow: '0 0 15px rgba(52, 211, 153, 0.4)'
              }}
            >
              Email Copied to Clipboard!
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Socials & Recruiter links */}
        <motion.div 
          variants={itemVars}
          className="social-row"
          style={{ 
            marginTop: '3.5rem', 
            display: 'flex', 
            gap: '1.5rem', 
            fontSize: '0.85rem', 
            textTransform: 'uppercase', 
            letterSpacing: '0.1em',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          {PROFILE.contact.socials.map((social, i) => (
            <Magnetic key={i}>
              <a href={social.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', padding: '8px 14px' }}>
                {social.name} ↗
              </a>
            </Magnetic>
          ))}
          <Magnetic>
            <a href={`tel:${PROFILE.contact.phone}`} style={{ display: 'inline-block', padding: '8px 14px' }}>
              Phone ↗
            </a>
          </Magnetic>
        </motion.div>
        
        <motion.div 
          variants={itemVars}
          style={{ marginTop: '4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} Somesh Dayama. All rights reserved.
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;


