import React from 'react';
import { motion } from 'framer-motion';
import Magnetic from './ui/Magnetic';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const Projects = () => {
  const projects = PROFILE.projects;

  return (
    <section id="projects" style={{ padding: '10vw 5vw', backgroundColor: 'transparent' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="text-title" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
          <MaskedText>Projects</MaskedText>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '3rem'
      }}>
        {projects.map((project, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Image Container */}
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#111', marginBottom: '1.5rem', display: 'block' }}>
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
              />
            </a>

            {/* Content */}
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase' }}>{project.title}</h3>
              <p className="font-serif" style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {project.description}
              </p>
              <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {project.techStack.map(tech => (
                  <span key={tech} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', color: 'var(--text-secondary)' }}>{tech}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--text-muted)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{project.year}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Magnetic>
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.8rem', display: 'inline-block', padding: '10px', color: 'var(--text-secondary)' }}>
                      GitHub ↗
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.8rem', display: 'inline-block', padding: '10px' }}>
                      Live ↗
                    </a>
                  </Magnetic>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
