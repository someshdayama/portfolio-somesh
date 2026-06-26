import React from 'react';
import { motion } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const About = () => {
  const itemVars = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const skillsContainerVars = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const skillTagVars = {
    hidden: { opacity: 0, scale: 0.85, y: 12 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 120, damping: 12 } 
    }
  };

  const { about } = PROFILE;

  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '10vw 8vw 2vw 8vw', position: 'relative' }}>
      <div style={{ maxWidth: '900px', width: '100%' }}>
        <h2 className="text-title font-serif" style={{ marginBottom: '3rem' }}>
          <MaskedText>Profile</MaskedText>
        </h2>

        <motion.p 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          className="text-body" 
          style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '4rem', maxWidth: '100%' }}
        >
          {about.summary}
        </motion.p>

        {/* Experience Section */}
        <motion.h3 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}
        >
          Experience
        </motion.h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          {about.experience.map((exp, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={itemVars}
              style={{ position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{exp.position} — {exp.company}</h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{exp.period}</span>
              </div>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '1rem', paddingLeft: '1rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
          style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}
        >
          Education
        </motion.h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          {about.education.map((edu, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={itemVars}
            >
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{edu.degree}</h4>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{edu.institution}</div>
            </motion.div>
          ))}
        </div>

        {/* Skills/Tools Section */}
        <motion.h3 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={itemVars}
          style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}
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
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-secondary)' }}>{skillGroup.category}</h4>
              <motion.div 
                variants={skillsContainerVars}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}
              >
                {skillGroup.items.map(skill => (
                  <motion.span
                    key={skill}
                    variants={skillTagVars}
                    whileHover={{ scale: 1.06, color: '#ffffff', borderColor: '#ffffff', boxShadow: '0 0 12px rgba(255,255,255,0.15)' }}
                    className="clickable-skill"
                    style={{ 
                      border: '1px solid var(--text-muted)', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '50px', 
                      fontSize: '0.9rem', 
                      cursor: 'pointer', 
                      display: 'inline-block',
                      transition: 'color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease'
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

