import React from 'react';
import { motion } from 'framer-motion';

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

  return (
    <section id="about" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', padding: '10vw' }}>
      <motion.div
        variants={containerVars}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        style={{ maxWidth: '900px' }}
      >
        <motion.h2 variants={itemVars} className="text-title" style={{ marginBottom: '3rem' }}>Profile</motion.h2>
        
        <motion.p variants={itemVars} className="text-body font-serif" style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '4rem', maxWidth: '100%' }}>
          Results-driven Software Engineer with over 3 years of experience specializing in cloud infrastructure, high-performance CI/CD automation, and site reliability engineering. Adept at optimizing system architecture across GCP, Azure, and AWS to drive down cloud expenditures and maximize deployment frequencies. Leverages automated tooling and agile practices as a force multiplier to streamline complex release management, eliminate technical debt, and ensure zero-drift infrastructure stability.
        </motion.p>

        {/* Experience Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Experience</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Software Engineer — NCR Atleos Corporation</h4>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Feb 2025 - Present</span>
            </div>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '1rem', paddingLeft: '1rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Managed release lifecycles and cross-functional CI/CD coordination for the AMP Services Product on Azure.</li>
              <li>Functioned as primary Incident Commander for mission-critical production outages.</li>
              <li>Spearheaded infrastructure provisioning and environment setup using GCP (GKE, Compute Engine), utilizing Jenkins, Helm, and Ansible.</li>
            </ul>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Software Engineer — Monocept Consulting Pvt. Ltd.</h4>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>May 2023 - Feb 2025</span>
            </div>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '1rem', paddingLeft: '1rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Developed automated scripts and engineered resource allocation strategies on GCP, delivering a 34.56% reduction in cloud infrastructure costs.</li>
              <li>Architected automated database maintenance blueprints and failover strategies utilizing Terraform and Ansible.</li>
              <li>Orchestrated environment deployment for the Authentic Switch application using Terraform.</li>
            </ul>
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Trainee Software Engineer — Monocept Consulting Pvt. Ltd.</h4>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Jan 2023 - Apr 2023</span>
            </div>
            <ul style={{ color: 'var(--text-secondary)', fontSize: '1rem', paddingLeft: '1rem', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Automated Jenkins-based deployment pipelines for the flagship Domino’s App (Jubilant Foods).</li>
              <li>Managed Linux virtual environments and leveraged AWS core services to dynamically provision scalable staging environments.</li>
            </ul>
          </div>
        </div>

        {/* Education Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Education</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Master of Computer Applications (MCA)</h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>National Institute of Technology (NIT), Bhopal — 2023</div>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Bachelor of Computer Applications (BCA)</h4>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Prestige Institute of Management and Research, Indore — 2020</div>
          </div>
        </div>
        
        {/* Skills/Tools Section */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--text-muted)', paddingBottom: '1rem' }}>Expertise & Tools</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
          {["GCP", "AWS", "Azure", "Terraform", "Ansible", "Docker", "Kubernetes (GKE)", "Helm", "Jenkins", "GitHub Actions", "Python", "Java", "Prometheus", "Grafana"].map(skill => (
            <span key={skill} style={{ border: '1px solid var(--text-muted)', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.9rem' }}>{skill}</span>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
