import React, { useEffect, useRef } from 'react';
import { useScroll, useVelocity, useSpring } from 'framer-motion';

const StarryBackground = () => {
  const canvasRef = useRef(null);

  // Use Framer Motion to get flawlessly smooth scroll velocity
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let stars = [];

    const baseSpeed = 0.6;
    const maxZ = 2000;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 60;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 60;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const colors = [
      '255, 255, 255',   // Crisp White
      '255, 255, 255',   // Crisp White
      '255, 255, 255'    // Crisp White
    ];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 1800);
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * canvas.width * 2.2,
          y: (Math.random() - 0.5) * canvas.height * 2.2,
          z: Math.random() * maxZ,
          o: Math.random() * 0.75 + 0.25,
          size: Math.random() * 1.6 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)],
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.02 + Math.random() * 0.03
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // Calculate instantaneous speed based on smooth scroll velocity safely
      const rawVelocity = smoothVelocity.get();
      const velocity = (typeof rawVelocity === 'number' && !isNaN(rawVelocity)) ? rawVelocity : 0;
      const cappedVelocity = Math.max(-5000, Math.min(5000, velocity));
      const currentSpeed = baseSpeed + (cappedVelocity * 0.005);

      // Mouse parallax smooth interpolation
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Pure black translucent clearing for smooth star trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2 + currentMouseX;
      const centerY = canvas.height / 2 + currentMouseY;

      // Render Stars - strictly forward motion towards the viewer
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Ensure currentSpeed is strictly positive so motion is always forward towards the screen
        const forwardSpeed = Math.max(0.4, currentSpeed);
        const prevZ = star.z;
        star.z -= forwardSpeed;
        star.twinklePhase += star.twinkleSpeed;

        if (star.z <= 0.1) {
          star.z = maxZ;
          star.x = (Math.random() - 0.5) * canvas.width * 2.2;
          star.y = (Math.random() - 0.5) * canvas.height * 2.2;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;
        const s = Math.max(star.size * k, 0.7);

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const distanceFade = Math.max(0, Math.min(1, 1 - (star.z / maxZ)));
          const twinkleFactor = 0.7 + 0.3 * Math.sin(star.twinklePhase);
          const opacity = star.o * Math.pow(distanceFade, 1.5) * twinkleFactor;

          if (opacity > 0.02) {
            // Draw speed trail when scrolling fast or when star is close to viewer
            if (forwardSpeed > 1.5 || star.z < 500) {
              const prevK = 128.0 / Math.min(maxZ, prevZ + forwardSpeed * 2.5);
              const prevPx = star.x * prevK + centerX;
              const prevPy = star.y * prevK + centerY;

              ctx.beginPath();
              ctx.strokeStyle = `rgba(${star.color}, ${opacity})`;
              ctx.lineWidth = s;
              ctx.moveTo(prevPx, prevPy);
              ctx.lineTo(px, py);
              ctx.stroke();
            } else {
              ctx.fillStyle = `rgba(${star.color}, ${opacity})`;
              ctx.beginPath();
              ctx.arc(px, py, s / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [smoothVelocity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#000000'
      }}
    />
  );
};

export default StarryBackground;

