import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, ArrowRight } from 'lucide-react';
import SectionReveal from './ui/SectionReveal';
import Magnetic from './ui/Magnetic';

const Contact = () => {
  return (
    <footer id="contact" style={{ padding: '10rem 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
      <div className="grid-bg"></div>
      
      <SectionReveal>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Contact</div>
          <h2 className="text-gradient" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, marginBottom: '3rem' }}>
            Let's build <br/> something <span className="accent-text">great.</span>
          </h2>
          
          <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', marginBottom: '4rem', opacity: 0.8 }}>
            Always looking for new challenges to resolve and meaningful collaborations.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '8rem' }}>
            <Magnetic>
              <a href="mailto:someshdayama2@gmail.com" className="btn btn-primary" style={{ padding: '1.25rem 3rem' }}>
                Shoot an Email <ArrowRight size={20} />
              </a>
            </Magnetic>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '5rem' }}>
            {[
              { icon: <Github />, href: "https://github.com/someshdayama" },
              { icon: <Linkedin />, href: "https://linkedin.com/in/somesh-dayama" },
              { icon: <Mail />, href: "mailto:someshdayama2@gmail.com" }
            ].map((social, i) => (
              <Magnetic key={i}>
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass"
                  style={{ 
                    width: '64px', 
                    height: '64px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    borderRadius: '20px',
                    color: 'white',
                    backgroundColor: 'rgba(255,255,255,0.03)'
                  }}
                >
                  {social.icon}
                </a>
              </Magnetic>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '3rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600 }}>
            <p>© {new Date().getFullYear()} Somesh Dayama. Strategic Problem Solver.</p>
          </div>
        </div>
      </SectionReveal>

      {/* Background Glow */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-20%', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        width: '60vw', 
        height: '40vw', 
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
        filter: 'blur(100px)',
        zIndex: -1
      }}></div>
    </footer>
  );
};

export default Contact;
