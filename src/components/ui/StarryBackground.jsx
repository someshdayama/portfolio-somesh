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
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let stars = [];
    
    const baseSpeed = 0.5;
    const maxZ = 2500; 

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 3000); 
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: (Math.random() - 0.5) * canvas.width * 2,
          y: (Math.random() - 0.5) * canvas.height * 2,
          z: Math.random() * maxZ,
          o: Math.random() * 0.8 + 0.2, 
          size: Math.random() * 1.5 + 0.5
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // Calculate instantaneous speed based on smooth scroll velocity
      const velocity = smoothVelocity.get();
      // Cap the added velocity so it doesn't get insanely fast during flick scrolls
      const cappedVelocity = Math.max(-5000, Math.min(5000, velocity));
      const currentSpeed = baseSpeed + (cappedVelocity * 0.005);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        star.z -= currentSpeed;
        
        if (star.z <= 0) {
          star.z = maxZ;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }
        
        if (star.z > maxZ) {
          star.z = 0.1;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        const k = 128.0 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;
        const s = Math.max(star.size * k, 0.1);

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          if (Math.abs(currentSpeed) > 3) {
             const prevK = 128.0 / (star.z + currentSpeed * 2);
             const prevPx = star.x * prevK + centerX;
             const prevPy = star.y * prevK + centerY;
             
             ctx.beginPath();
             ctx.strokeStyle = `rgba(255, 255, 255, ${star.o})`;
             ctx.lineWidth = s;
             ctx.moveTo(prevPx, prevPy);
             ctx.lineTo(px, py);
             ctx.stroke();
          } else {
             // Highly performant rectangular rendering for tiny stars instead of heavy vector path arc circles
             ctx.fillStyle = `rgba(255, 255, 255, ${star.o})`;
             ctx.fillRect(px - s / 2, py - s / 2, s, s);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
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
