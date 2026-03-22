import React from 'react';
import { motion } from 'framer-motion';
import SectionReveal from './ui/SectionReveal';

const Experience = () => {
  const experiences = [
    {
      company: "NCR Atleos",
      role: "Software Engineer, Scrum Master & RTE",
      period: "Feb 2025 – Present",
      location: "Mumbai, IND",
      points: [
        "Head as Scrum Master and RTE for a cross-functional team of 17 members.",
        "Lead Strategic Resolution for high-priority production incidents and architecture bottlenecks.",
        "Manage and optimize GCP infrastructure for Azure-based AMP Services Product.",
        "Orchestrate end-to-end cloud-native development and infrastructure automation."
      ]
    },
    {
      company: "Monocept Consulting",
      role: "Software Engineer (Cloud & SRE)",
      period: "May 2023 – Feb 2025",
      location: "Hyderabad, IND",
      points: [
        "Engineered significant reduction in GCP cloud costs via Terraform-led refactoring.",
        "Decreased production incidents by implementing comprehensive monitoring using Prometheus and Grafana alerting.",
        "Designed and maintained scalable deployment systems for mission-critical apps.",
        "Automated Jenkins pipelines for Domino's App, accelerating feedback loops."
      ]
    },
    {
      company: "Monocept",
      role: "Trainee Software Engineer",
      period: "Jan 2023 – Apr 2023",
      location: "Remote",
      points: [
        "Collaborated on Jubilant Foods Project, developing robust CI/CD Pipelines.",
        "Authored Jenkins Groovy scripts and managed Docker environments.",
        "Developed and maintained Kubernetes YAML configurations.",
      ]
    }
  ];

  return (
    <section id="experience">
      <SectionReveal>
        <div className="section-label">Professional Path</div>
        <h2 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '5rem' }}>Experience</h2>
      </SectionReveal>

      <div style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '1px', background: 'linear-gradient(to bottom, transparent, var(--accent-primary), transparent)', opacity: 0.3 }}></div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {experiences.map((exp, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <div style={{ position: 'relative', paddingLeft: '60px' }}>
                <div style={{ position: 'absolute', left: '11px', top: '10px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', boxShadow: '0 0 20px var(--accent-primary)', zIndex: 1 }}></div>
                
                <div className="glass glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{exp.company}</h3>
                      <p className="accent-text" style={{ fontSize: '1.2rem', fontWeight: 600 }}>{exp.role}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, opacity: 0.6 }}>{exp.period}</span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{exp.location}</p>
                    </div>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {exp.points.map((point, j) => (
                      <li key={j} style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '1.1rem' }}>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
