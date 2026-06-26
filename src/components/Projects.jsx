import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Magnetic from './ui/Magnetic';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

const ProjectRow = ({ project, i, isEven }) => {
  const imageRef = useRef(null);

  // Mouse positions relative to the image container (stable on static overlay)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Sheen coordinates
  const sheenX = useMotionValue(-1000);
  const sheenY = useMotionValue(-1000);

  // Smooth spring animations for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), { damping: 25, stiffness: 150 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { damping: 25, stiffness: 150 });

  // Sheen gradient background mapping
  const sheenBg = useTransform(
    [sheenX, sheenY],
    ([lx, ly]) => `radial-gradient(circle 260px at ${lx}px ${ly}px, rgba(255, 255, 255, 0.1), transparent 80%)`
  );

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
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

  // Staggered text animations
  const textContainerVars = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const textItemVars = {
    hidden: { opacity: 0, x: isEven ? 40 : -40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isEven ? 'row' : 'row-reverse',
        alignItems: 'center',
        gap: '5vw',
        width: '100%',
        flexWrap: 'wrap'
      }}
    >
      {/* 3D Image Card Column (50% width on desktop) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        style={{ 
          flex: '1 1 450px', 
          perspective: 1500,
          transformStyle: "preserve-3d",
          position: 'relative'
        }}
      >
        {/* The Tilting Card */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            width: '100%',
            aspectRatio: '1.55/1',
            backgroundColor: '#111111',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            position: 'relative',
          }}
          whileHover={{
            scale: 1.015,
            borderColor: 'rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
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
              zIndex: 3,
            }}
          />
          <div style={{ display: 'block', width: '100%', height: '100%' }}>
            <motion.img
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              src={project.image}
              alt={project.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85, display: 'block' }}
            />
          </div>
        </motion.div>

        {/* STATIC MOUSE DETECTOR OVERLAY (prevents 3D tilt jitter feedback loop) */}
        <a
          ref={imageRef}
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 10,
            cursor: 'pointer',
            display: 'block',
            borderRadius: '16px'
          }}
        />
      </motion.div>

      {/* Details Description Column (50% width on desktop) */}
      <motion.div 
        variants={textContainerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >
        <motion.div variants={textItemVars}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 600 }}>PROJECT 0{i + 1}</span>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 700, marginTop: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{project.title}</h3>
        </motion.div>
        
        <motion.p variants={textItemVars} className="font-serif" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>
          {project.description}
        </motion.p>

        {/* Tech Stack */}
        <motion.div variants={textItemVars} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {project.techStack.map(tech => (
            <span key={tech} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: '30px', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.02)' }}>{tech}</span>
          ))}
        </motion.div>

        {/* Links */}
        <motion.div variants={textItemVars} style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <Magnetic>
            <a href={project.repo} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.8rem', display: 'inline-block', padding: '8px 0', color: 'var(--text-secondary)' }}>
              GitHub Repo ↗
            </a>
          </Magnetic>
          <Magnetic>
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, fontSize: '0.8rem', display: 'inline-block', padding: '8px 0' }}>
              Live Application ↗
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </div>
  );
};

const Projects = () => {
  const projects = PROFILE.projects;

  return (
    <section id="projects" style={{ padding: '4vw 8vw 10vw 8vw', backgroundColor: 'transparent' }}>
      <div style={{ marginBottom: '6rem' }}>
        <h2 className="text-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}>
          <MaskedText>Projects</MaskedText>
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
        {projects.map((project, i) => {
          const isEven = i % 2 === 0;
          return (
            <ProjectRow key={i} project={project} i={i} isEven={isEven} />
          );
        })}
      </div>
    </section>
  );
};

export default Projects;

