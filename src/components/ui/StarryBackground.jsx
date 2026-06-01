import React, { useEffect, useRef } from 'react';

const StarryBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let stars = [];
    
    // Speed and scroll direction variables
    const baseSpeed = 0.5;
    const maxSpeed = 10; // Significantly reduced max speed
    let currentSpeed = baseSpeed;
    let targetSpeed = baseSpeed;
    let scrollTimeout;
    let lastScrollY = window.scrollY;

    const maxZ = 2500; // Extended depth so dots come from far away

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
          x: (Math.random() - 0.5) * canvas.width * 2, // Spread wide
          y: (Math.random() - 0.5) * canvas.height * 2, // Spread high
          z: Math.random() * maxZ,
          o: Math.random() * 0.8 + 0.2, 
          size: Math.random() * 1.5 + 0.5
        });
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine scroll direction
      const isScrollingDown = currentScrollY > lastScrollY;
      
      // If scrolling down, move forward. If scrolling up, move in reverse.
      targetSpeed = isScrollingDown ? maxSpeed : -maxSpeed;
      lastScrollY = currentScrollY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        targetSpeed = baseSpeed; // Return to slow forward drift
      }, 100); 
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    resize();

    const draw = () => {
      // Smoothly interpolate current speed towards target speed
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;

      // Dark trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // Z axis dictates depth. Reducing it moves it closer to camera.
        star.z -= currentSpeed;
        
        // Forward bounds: Recycle star when it passes the camera
        if (star.z <= 0) {
          star.z = maxZ;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }
        
        // Reverse bounds: Recycle star when it goes too far back (scrolling up)
        if (star.z > maxZ) {
          star.z = 0.1;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // 3D to 2D projection calculation
        const k = 128.0 / star.z;
        const px = star.x * k + centerX;
        const py = star.y * k + centerY;
        const s = Math.max(star.size * k, 0.1);

        // Draw if within bounds
        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          ctx.beginPath();
          
          // Draw warp lines if moving quickly (forward or reverse)
          if (Math.abs(currentSpeed) > 3) {
             const prevK = 128.0 / (star.z + currentSpeed * 2);
             const prevPx = star.x * prevK + centerX;
             const prevPy = star.y * prevK + centerY;
             
             ctx.strokeStyle = `rgba(255, 255, 255, ${star.o})`;
             ctx.lineWidth = s;
             ctx.moveTo(prevPx, prevPy);
             ctx.lineTo(px, py);
             ctx.stroke();
          } else {
             // Draw normal dots
             ctx.fillStyle = `rgba(255, 255, 255, ${star.o})`;
             ctx.arc(px, py, s, 0, Math.PI * 2);
             ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
