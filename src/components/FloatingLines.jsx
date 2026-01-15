import React, { useEffect, useRef } from 'react';
import './FloatingLines.css';

const FloatingLines = ({
  lineCount = 40,
  colors = ['#FFD700', '#F5B800', '#C9980C'], // Golden gradient colors
  speed = 1,
  lineWidth = 1,
  className = '',
  style = {}
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Initialize lines
    const initLines = () => {
      linesRef.current = [];
      for (let i = 0; i < lineCount; i++) {
        linesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 150 + 50,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.5 + 0.2) * speed,
          rotationSpeed: (Math.random() - 0.5) * 0.02 * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
          width: Math.random() * lineWidth + 0.5
        });
      }
    };

    initLines();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      linesRef.current.forEach((line) => {
        // Update position
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;
        line.angle += line.rotationSpeed;

        // Wrap around edges
        if (line.x < -line.length) line.x = width + line.length;
        if (line.x > width + line.length) line.x = -line.length;
        if (line.y < -line.length) line.y = height + line.length;
        if (line.y > height + line.length) line.y = -line.length;

        // Draw line
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;

        // Create gradient for each line
        const gradient = ctx.createLinearGradient(line.x, line.y, endX, endY);
        gradient.addColorStop(0, `${line.color}00`);
        gradient.addColorStop(0.5, line.color);
        gradient.addColorStop(1, `${line.color}00`);

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.width;
        ctx.globalAlpha = line.opacity;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initLines();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [lineCount, colors, speed, lineWidth]);

  return (
    <canvas
      ref={canvasRef}
      className={`floating-lines-canvas ${className}`}
      style={style}
    />
  );
};

export default FloatingLines;