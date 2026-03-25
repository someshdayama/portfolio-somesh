import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Settings, Cloud, Terminal } from 'lucide-react';
import SectionReveal from './ui/SectionReveal';

const About = () => {
  const stats = [
    { label: "Cost Optimization", value: "Substantial", sub: "GCP & AWS Savings", icon: <BarChart3 /> },
    { label: "Reliability", value: "High-Uptime", sub: "Proactive Monitoring", icon: <Settings /> },
    { label: "Experience", value: "3+ Years", sub: "Cloud-Native & SRE", icon: <Cloud /> }
  ];

  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <SectionReveal>
        <div className="glass glass-card" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Identity</div>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            A Software Engineer with a deep foundation in DevOps and Cloud Infrastructure, currently serving as a Release
            Train Engineer (RTE) for a 17-member team. I blend technical expertise from cloud side with Scrum Master role to bridge
            the gap between complex engineering requirements.
          </p>
        </div>
      </SectionReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <SectionReveal key={i} delay={i * 0.1}>
            <div className="glass glass-card" style={{ textAlign: 'center', height: '100%' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}>
                {stat.icon}
              </div>
              <h3 className="accent-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{stat.value}</h3>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.sub}</p>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
};

export default About;
