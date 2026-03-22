import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Cloud, Cpu, Sparkles, ChevronDown } from 'lucide-react';
import Magnetic from './ui/Magnetic';

const Hero = () => {
  const [title, setTitle] = useState("DevOps Engineer");
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const rotateX = useTransform(springY, [-500, 500], [10, -10]);
  const rotateY = useTransform(springX, [-500, 500], [-10, 10]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX - innerWidth / 2);
    mouseY.set(clientY - innerHeight / 2);
  };

  useEffect(() => {
    const phrases = ["DevOps Engineer", "Scrum Master", "Weekend Vibe Coder"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      scrambleText(phrases[i]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrambleText = (finalText) => {
    const chars = "!<>-_\\/[]{}—=+*^?#________";
    let iteration = 0;
    const interval = setInterval(() => {
      setTitle(prev => finalText.split("")
        .map((char, index) => {
          if (index < iteration) return finalText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("")
      );
      if (iteration >= finalText.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <section
      id="hero"
      className="hero"
      onMouseMove={handleMouseMove}
      style={{ perspective: '1200px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="grid-bg"></div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="hero-content"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          style={{ transform: 'translateZ(100px)' }}
        >
          <div className="section-label" style={{ justifyContent: 'center' }}>Available for Scale</div>
          <h1 style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Somesh <span className="accent-text">Dayama</span>
          </h1>
          <h2 className="text-gradient" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', minHeight: '1.2em', marginBottom: '2.5rem' }}>
            {title}
          </h2>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 4rem', lineHeight: '1.7' }}>
            Building <span style={{ color: 'white', fontWeight: 600 }}>resilient cloud systems</span> and orchestrating
            high-performing teams to resolve complex architecture bottlenecks.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Magnetic>
              <a href="#projects" className="btn btn-primary">Explore Work</a>
            </Magnetic>
            <Magnetic>
              <a href="#contact" className="btn btn-secondary">Get in Touch</a>
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '15%', left: '10%', opacity: 0.1, color: 'var(--accent-primary)' }}
      >
        <Cloud size={200} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '20%', right: '10%', opacity: 0.1, color: 'var(--accent-secondary)' }}
      >
        <Cpu size={180} />
      </motion.div>

      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ position: 'absolute', top: '20%', right: '20%', color: 'var(--accent-primary)' }}
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
