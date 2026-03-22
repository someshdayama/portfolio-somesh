import React from 'react';
import SectionReveal from './ui/SectionReveal';

const Education = () => {
  return (
    <section id="education">
      <SectionReveal>
        <div className="section-label">Foundation</div>
        <h2 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '4rem' }}>Education</h2>
      </SectionReveal>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        <SectionReveal delay={0.1}>
          <div className="glass glass-card" style={{ height: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>Master of Computer Applications (MCA)</h3>
            <p className="accent-text" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>NIT Bhopal</p>
            <div style={{ padding: '0.5rem 1rem', display: 'inline-block', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 700 }}>Class of 2023</div>
          </div>
        </SectionReveal>
        
        <SectionReveal delay={0.2}>
          <div className="glass glass-card" style={{ height: '100%' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>Bachelor of Computer Applications (BCA)</h3>
            <p className="accent-text" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Prestige Institute (PIMR)</p>
            <div style={{ padding: '0.5rem 1rem', display: 'inline-block', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '0.85rem', fontWeight: 700 }}>Class of 2020</div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default Education;
