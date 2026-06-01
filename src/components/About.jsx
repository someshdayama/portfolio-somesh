import React from 'react';
import { motion } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const About = () => {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const { about } = PROFILE;

  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '10vw', position: 'relative' }}>
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ maxWidth: '900px', width: '100%' }}
      >
        <h2 className="text-title font-serif" style={{ marginBottom: '3rem' }}>
          <MaskedText>Profile</MaskedText>
        </h2>

        <motion.p variants={itemVars} className="text-body" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '4rem', maxWidth: '100%' }}>
          {about.summary}
        </motion.p>

        {/* Experience Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Experience</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          {about.experience.map((exp, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>{exp.position} — {exp.company}</h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{exp.period}</span>
              </div>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '1rem', paddingLeft: '1rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Education</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          {about.education.map((edu, i) => (
            <div key={i}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{edu.degree}</h4>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{edu.institution}</div>
            </div>
          ))}
        </div>

        {/* Skills/Tools Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Expertise & Tools</h3>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}
        >
          {about.skills.map(skill => (
            <motion.span
              key={skill.name}
              whileHover={{ color: '#fff', borderColor: '#fff' }}
              style={{ border: '1px solid var(--text-muted)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              {skill.name}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
