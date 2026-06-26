import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Magnetic from './ui/Magnetic';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const ProjectCard = ({ project, i }) => {
  const ref = useRef(null);

  // Mouse positions relative to the card container
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Sheen coordinates
  const sheenX = useMotionValue(-1000);
  const sheenY = useMotionValue(-1000);

  // Smooth spring animations for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [18, -18]), { damping: 20, stiffness: 180 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-18, 18]), { damping: 20, stiffness: 180 });

  // Sheen gradient background mapping
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([lx, ly]) => `radial-gradient(circle 220px at ${lx}px ${ly}px, rgba(255, 255, 255, 0.08), transparent 80%)`
  );

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Set sheen coordinates
    sheenX.set(mouseX);
    sheenY.set(mouseY);

    // Normalize between -0.5 and 0.5
    x.set((mouseX - width / 2) / width);
    y.set((mouseY - height / 2) / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    sheenX.set(-1000);
    sheenY.set(-1000);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1500,
        transformStyle: "preserve-3d",
      }}
      // Scroll reveal trigger
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          display: 'flex', 
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '1.75rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)',
          transition: 'border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
        }}
        whileHover={{
          scale: 1.02,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Sheen Overlay reflection */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: sheenBg,
            pointerEvents: 'none',
            borderRadius: '16px',
            zIndex: 1,
          }}
        />

        {/* Image Container with 3D Pop */}
        <a 
          href={project.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            width: '100%', 
            aspectRatio: '1.45/1', 
            overflow: 'hidden', 
            backgroundColor: '#111', 
            marginBottom: '1.5rem', 
            display: 'block',
            borderRadius: '10px',
            transform: 'translateZ(40px)', // popped further out in 3D
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            position: 'relative',
            zIndex: 2
          }}
        >
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            src={project.image}
            alt={project.title}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </a>

        {/* Content with 3D Pop */}
        <div style={{ transform: 'translateZ(20px)', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', zIndex: 2 }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{project.title}</h3>
          <p className="font-serif" style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1.5rem', flexGrow: 1, minHeight: '60px' }}>
            {project.description}
          </p>
          
          {/* Tech Stack */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.techStack.map(tech => (
              <span key={tech} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '20px', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.03)' }}>{tech}</span>
            ))}
          </div>
          
          {/* Footer Info & Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', marginTop: 'auto' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{project.year}</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <Magnetic>
                <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.75rem', display: 'inline-block', padding: '8px 12px', color: 'var(--text-secondary)' }}>
                  GitHub ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.75rem', display: 'inline-block', padding: '8px 12px' }}>
                  Live ↗
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects = () => {
  const projects = PROFILE.projects;

  return (
    <section id="projects" style={{ padding: '2vw 8vw 10vw 8vw', backgroundColor: 'transparent' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h2 className="text-title" style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}>
          <MaskedText>Projects</MaskedText>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3.5rem'
      }}>
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} i={i} />
        ))}
      </div>
    </section>
  );
};

export default Projects;

