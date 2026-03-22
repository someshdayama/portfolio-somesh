import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Globe } from 'lucide-react';
import SectionReveal from './ui/SectionReveal';
import velocityImg from '../assets/velocity.png';
import weatherImg from '../assets/weather.png';
import resumeImg from '../assets/resume-builder.png';

const Projects = () => {
  const projects = [
    {
      title: "Velocity Speedtest",
      description: "A high-performance network speed testing application providing real-time insights.",
      link: "https://velocity-speedtest.netlify.app/",
      image: velocityImg,
      tags: ["React", "Performance", "Web APIs"]
    },
    {
      title: "Ambient Weather",
      description: "A minimalist weather application providing real-time atmospheric data with premium glassmorphism.",
      link: "https://ambientweather.netlify.app/",
      image: weatherImg,
      tags: ["React", "Weather API", "Glassmorphism"]
    },
    {
      title: "Resume Builder Promptly",
      description: "AI-powered resume generator that transforms work history into professional templates.",
      link: "https://resumebuilder-promptly.vercel.app/",
      image: resumeImg,
      tags: ["AI/ML", "Next.js", "PDF Generation"]
    }
  ];

  return (
    <section id="projects">
      <SectionReveal>
        <div className="section-label">Selected Works</div>
        <h2 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Innovation Lab</h2>
      </SectionReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2.5rem' }}>
        {projects.map((project, i) => (
          <SectionReveal key={i} delay={i * 0.1}>
            <div className="glass" style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  src={project.image} 
                  alt={project.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', opacity: 0.6 }}></div>
              </div>
              <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', flex: 1, lineHeight: '1.7' }}>{project.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  {project.tags.map((tag, j) => (
                    <span key={j} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(59, 130, 246, 0.2)' }}>{tag}</span>
                  ))}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Globe size={18} /> Live Preview
                </a>
              </div>
            </div>
          </SectionReveal>
        ))}
      </div>
    </section>
  );
};

export default Projects;
