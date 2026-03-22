import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Settings, Terminal, BarChart3, Sparkles } from 'lucide-react';
import SectionReveal from './ui/SectionReveal';

const BentoSkills = () => {
  const skills = [
    { category: "Cloud & K8s", sub: "GCP, AWS, Azure, GKE", icon: <Cloud />, size: "col-span-2 row-span-1" },
    { category: "Infrastructure", sub: "Terraform, Ansible, Helm", icon: <Settings />, size: "col-span-1 row-span-1" },
    { category: "Automation", sub: "Jenkins, GitHub Actions, Python", icon: <Terminal />, size: "col-span-1 row-span-2" },
    { category: "Observability", sub: "Prometheus, Grafana, ELK", icon: <BarChart3 />, size: "col-span-2 row-span-1" },
  ];

  return (
    <section id="skills">
      <SectionReveal>
        <div className="section-label">Technical Core</div>
        <h2 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>High-Level Abstracted Architect</h2>
      </SectionReveal>

      <div className="bento-grid" style={{ gridTemplateRows: 'repeat(3, 180px)' }}>
        {/* Main AI Bento Box */}
        <div className="glass glass-card" style={{ gridColumn: 'span 2', gridRow: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <Sparkles style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'var(--accent-primary)', opacity: 0.3 }} size={64} />
          <h3 className="accent-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>AI-Powered Force Multiplier</h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            The transition from "how" to "what" transforms the modern engineer into a strategic lead. 
            I leverage AI to rapid-prototype complex systems, allowing me to focus on high-level architecture 
            and product scalability.
          </p>
        </div>

        {/* Skill Bento Blocks */}
        {skills.map((skill, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 0.98 }}
            className="glass glass-card"
            style={{ 
              gridColumn: skill.size.includes('col-span-2') ? 'span 2' : 'span 1',
              gridRow: skill.size.includes('row-span-2') ? 'span 2' : 'span 1',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              padding: '2rem'
            }}
          >
            <div style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>{skill.icon}</div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white' }}>{skill.category}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{skill.sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BentoSkills;
