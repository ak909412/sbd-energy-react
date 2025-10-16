import React, { useEffect, useRef } from 'react';

class Particle {
  constructor(x, y, vx, vy, size) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.vx = vx + (Math.random() - 0.5) * 1.5;
    this.vy = vy + (Math.random() - 0.5) * 1.5;
    this.life = 0;
    this.maxLife = 120 + Math.random() * 100;
    
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.el.setAttribute('cx', this.x.toString());
    this.el.setAttribute('cy', this.y.toString());
    this.el.setAttribute('r', this.size.toString());
    this.el.setAttribute('fill', `url(#particleGradient${Math.floor(Math.random() * 3)})`);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life++;

    // Match background opacity levels (0.35 max like the bg)
    const lifeRatio = this.life / this.maxLife;
    const opacity = (1 - lifeRatio) * 0.35; // Matching bg opacity
    this.el.setAttribute('opacity', opacity.toString());
    
    // Gradually expand like smoke
    const scale = 1 + (lifeRatio * 1.8); // More expansion for diffusion
    const newSize = this.size * scale;
    this.el.setAttribute('r', newSize.toString());
  }

  render() {
    this.el.setAttribute('cx', this.x.toString());
    this.el.setAttribute('cy', this.y.toString());
  }

  isDead() {
    return this.life >= this.maxLife;
  }

  remove() {
    this.el.remove();
  }
}

export const SmokeyCursor = () => {
  const svgRef = useRef(null);
  const wrapperRef = useRef(null);
  const cursorRef = useRef(null);

  const mouseRef = useRef({
    x: 0,
    y: 0,
    smoothX: 0,
    smoothY: 0,
    diff: 0
  });

  const prevMouseRef = useRef({ x: 0, y: 0 });

  const viewportRef = useRef({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  const particlesRef = useRef([]);
  const animationIdRef = useRef(undefined);
  const emitCounterRef = useRef(0);

  useEffect(() => {
    const mouse = mouseRef.current;
    const prevMouse = prevMouseRef.current;
    const viewport = viewportRef.current;
    const particles = particlesRef.current;

    const onMouseMove = (e) => {
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const onResize = () => {
      viewport.width = window.innerWidth;
      viewport.height = window.innerHeight;

      if (svgRef.current) {
        svgRef.current.setAttribute('width', viewport.width.toString());
        svgRef.current.setAttribute('height', viewport.height.toString());
      }
    };

    const emitParticle = () => {
      if (mouse.diff < 0.2) return;

      const vx = (mouse.smoothX - prevMouse.x) * 0.1;
      const vy = (mouse.smoothY - prevMouse.y) * 0.1;
      const size = Math.min(mouse.diff * 0.6, 25) + 8;

      // Emit 2-3 particles per emission
      const particleCount = Math.floor(2 + Math.random() * 5);
      
      for (let i = 0; i < particleCount; i++) {
        const offsetX = (Math.random() - 0.5) * 15; // Wider spread
        const offsetY = (Math.random() - 0.5) * 15;
        
        const particle = new Particle(
          mouse.smoothX + offsetX, 
          mouse.smoothY + offsetY, 
          vx, 
          vy, 
          size * (0.8 + Math.random() * 0.4)
        );
        particles.push(particle);

        if (wrapperRef.current) {
          wrapperRef.current.appendChild(particle.el);
        }
      }
    };

    const render = () => {
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.15;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.15;
      mouse.diff = Math.hypot(mouse.x - mouse.smoothX, mouse.y - mouse.smoothY);

      emitCounterRef.current++;
      emitParticle();

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouse.smoothX}px, ${mouse.smoothY}px)`;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.render();

        if (particle.isDead()) {
          particle.remove();
          particles.splice(i, 1);
        }
      }

      animationIdRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    onResize();
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      particles.forEach(p => p.remove());
      particles.length = 0;
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* Cursor matching exact bg purple */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          width: '14px',
          height: '14px',
          background: 'radial-gradient(circle, rgba(138, 43, 226, 0.35) 0%, rgba(138, 43, 226, 0.15) 50%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 50,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen',
          left: 0,
          top: 0,
          boxShadow: '0 0 25px rgba(138, 43, 226, 0.25), 0 0 50px rgba(138, 43, 226, 0.15)'
        }}
      />

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          mixBlendMode: 'screen'
        }}
      >
        <defs>
          {/* Stronger blur for better blending */}
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>

          {/* Exact background purple - rgba(138, 43, 226) */}
          <radialGradient id="particleGradient0">
            <stop offset="0%" stopColor="rgb(138, 43, 226)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="rgb(138, 43, 226)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="rgb(138, 43, 226)" stopOpacity="0.08" />
          </radialGradient>

          {/* Slightly lighter variant */}
          <radialGradient id="particleGradient1">
            <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(138, 43, 226)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="rgb(138, 43, 226)" stopOpacity="0.05" />
          </radialGradient>

          {/* Subtle variation */}
          <radialGradient id="particleGradient2">
            <stop offset="0%" stopColor="rgb(138, 43, 226)" stopOpacity="0.32" />
            <stop offset="50%" stopColor="rgb(138, 43, 226)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="rgb(138, 43, 226)" stopOpacity="0.04" />
          </radialGradient>
        </defs>
        <g ref={wrapperRef} filter="url(#gooey)" />
      </svg>
    </div>
  );
};