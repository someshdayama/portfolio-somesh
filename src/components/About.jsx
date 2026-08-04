import React from 'react';
import { motion } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const About = () => {
  const itemVars = {
    hidden: { opacity: 0, y: 35 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const skillsContainerVars = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const skillTagVars = {
    hidden: { opacity: 0, scale: 0.85, y: 10 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 140, damping: 14 } 
    }
  };

  const { about } = PROFILE;

  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '6rem 6vw 4rem 6vw', position: 'relative' }}>
      <div style={{ maxWidth: '920px', width: '100%' }}>
        <h2 className="text-title font-serif" style={{ marginBottom: '3rem' }}>
          <MaskedText>Profile</MaskedText>
        </h2>

        <motion.p 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          className="text-body" 
          style={{ fontSize: 'clamp(1.15rem, 1.8vw, 1.55rem)', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '4rem', maxWidth: '100%' }}
        >
          {about.summary}
        </motion.p>

        {/* Experience Section */}
        <motion.h3 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          style={{ fontSize: '1.4rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '0.8rem' }}
        >
          Experience
        </motion.h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          {about.experience.map((exp, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={itemVars}
              whileHover={{ borderColor: 'rgba(255, 255, 255, 0.25)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              style={{ 
                position: 'relative',
                padding: '1.75rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>{exp.position} — <span style={{ color: '#93c5fd' }}>{exp.company}</span></h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>{exp.period}</span>
              </div>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', paddingLeft: '1.2rem', listStyleType: 'disc', display: 'flex', flexDirection: 'column', gap: '0.6rem', lineHeight: 1.5 }}>
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Education Section */}
        <motion.h3 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          style={{ fontSize: '1.4rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '0.8rem' }}
        >
          Education
        </motion.h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
          {about.education.map((edu, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={itemVars}
              style={{
                padding: '1.25rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.015)',
                border: '1px solid rgba(255, 255, 255, 0.06)'
              }}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{edu.degree}</h4>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.3rem' }}>{edu.institution}</div>
            </motion.div>
          ))}
        </div>

        {/* Skills/Tools Section */}
        <motion.h3 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          style={{ fontSize: '1.4rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '0.8rem' }}
        >
          Expertise & Tools
        </motion.h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {about.skills.map((skillGroup, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={itemVars}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.8rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{skillGroup.category}</h4>
              <motion.div 
                variants={skillsContainerVars}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}
              >
                {skillGroup.items.map(skill => (
                  <motion.span
                    key={skill}
                    variants={skillTagVars}
                    whileHover={{ scale: 1.05, color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.12)', borderColor: 'rgba(255, 255, 255, 0.4)', boxShadow: '0 0 15px rgba(255,255,255,0.15)' }}
                    className="clickable-skill"
                    style={{ 
                      border: '1px solid rgba(255, 255, 255, 0.15)', 
                      padding: '0.45rem 1rem', 
                      borderRadius: '50px', 
                      fontSize: '0.88rem', 
                      cursor: 'pointer', 
                      display: 'inline-block',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.25 ease'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;


