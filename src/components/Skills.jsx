import React from 'react';
import { motion } from 'framer-motion';
import MaskedText from './ui/MaskedText';
import { PROFILE } from '../data/profile';

// Icon mapping for skill categories
const CATEGORY_ICONS = {
  'Cloud Providers': '☁️',
  'Infrastructure & Containerization': '🐳',
  'CI/CD & Automation': '⚙️',
  'Scripting & Languages': '💻',
  'Observability': '📊',
  'Collaboration & Tools': '🧩',
  'Concepts': '🧠',
};

// Accent color per category for the bento glow
const CATEGORY_ACCENT = {
  'Cloud Providers': 'rgba(99, 179, 237, 0.12)',
  'Infrastructure & Containerization': 'rgba(52, 211, 153, 0.10)',
  'CI/CD & Automation': 'rgba(251, 191, 36, 0.10)',
  'Scripting & Languages': 'rgba(167, 139, 250, 0.10)',
  'Observability': 'rgba(251, 113, 133, 0.10)',
  'Collaboration & Tools': 'rgba(148, 163, 184, 0.10)',
  'Concepts': 'rgba(255, 255, 255, 0.06)',
};

const CATEGORY_BORDER = {
  'Cloud Providers': 'rgba(99, 179, 237, 0.25)',
  'Infrastructure & Containerization': 'rgba(52, 211, 153, 0.2)',
  'CI/CD & Automation': 'rgba(251, 191, 36, 0.2)',
  'Scripting & Languages': 'rgba(167, 139, 250, 0.2)',
  'Observability': 'rgba(251, 113, 133, 0.2)',
  'Collaboration & Tools': 'rgba(148, 163, 184, 0.2)',
  'Concepts': 'rgba(255, 255, 255, 0.08)',
};

// Featured cloud providers get large hero bento cells
const CLOUD_ICONS = {
  'GCP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
};

const containerVars = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 }
  }
};

const cellVars = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
  }
};

const tagVars = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 130, damping: 14 } }
};

const Skills = () => {
  const { skills } = PROFILE.about;
  const cloudGroup = skills.find(s => s.category === 'Cloud Providers');
  const otherGroups = skills.filter(s => s.category !== 'Cloud Providers');

  return (
    <section id="skills" style={{ padding: '4vw 8vw 6vw 8vw', position: 'relative' }}>
      <div style={{ marginBottom: '5rem' }}>
        <h2 className="text-title font-serif" style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)' }}>
          <MaskedText>Expertise</MaskedText>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '480px' }}>
          Cloud infrastructure, automation pipelines, and the tools that keep them running.
        </p>
      </div>

      {/* ── Hero Cloud Row ──────────────────────────────────────────────────── */}
      {cloudGroup && (
        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          {cloudGroup.items.map((provider) => (
            <motion.div
              key={provider}
              variants={cellVars}
              whileHover={{ scale: 1.03, borderColor: CATEGORY_BORDER['Cloud Providers'] }}
              style={{
                backgroundColor: CATEGORY_ACCENT['Cloud Providers'],
                border: `1px solid ${CATEGORY_BORDER['Cloud Providers']}`,
                borderRadius: '20px',
                padding: 'clamp(2rem, 3vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                textAlign: 'center',
                cursor: 'default',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow blob */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'rgba(99, 179, 237, 0.12)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
              }} />
              {CLOUD_ICONS[provider] && (
                <img
                  src={CLOUD_ICONS[provider]}
                  alt={provider}
                  style={{ width: 'clamp(40px, 5vw, 60px)', height: 'auto', filter: 'brightness(1.2)', position: 'relative' }}
                />
              )}
              <span style={{ fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', position: 'relative' }}>
                {provider}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Skill Groups Grid ─────────────────────────────────────────────── */}
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1rem',
        }}
      >
        {otherGroups.map((group) => {
          const accent = CATEGORY_ACCENT[group.category] || 'rgba(255,255,255,0.04)';
          const border = CATEGORY_BORDER[group.category] || 'rgba(255,255,255,0.08)';
          const icon = CATEGORY_ICONS[group.category] || '✦';

          return (
            <motion.div
              key={group.category}
              variants={cellVars}
              whileHover={{ scale: 1.02, borderColor: border }}
              style={{
                backgroundColor: accent,
                border: `1px solid ${border}`,
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 2vw, 2rem)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Category header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                <h4 style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                }}>
                  {group.category}
                </h4>
              </div>

              {/* Skill tags */}
              <motion.div
                variants={containerVars}
                style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
              >
                {group.items.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={tagVars}
                    whileHover={{
                      scale: 1.06,
                      color: '#ffffff',
                      borderColor: 'rgba(255,255,255,0.4)',
                      boxShadow: '0 0 14px rgba(255,255,255,0.1)',
                    }}
                    data-cursor="pointer"
                    style={{
                      border: '1px solid rgba(255,255,255,0.12)',
                      padding: '0.35rem 0.9rem',
                      borderRadius: '50px',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      cursor: 'default',
                      display: 'inline-block',
                      transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Skills;
