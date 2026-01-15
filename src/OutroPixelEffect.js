import React, { useEffect, useRef } from 'react';
import './OutroPixelEffect.css';

const OutroPixelEffect = () => {
    const canvasRef = useRef(null);
    const pixelsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Initialize pixels - ALL start ABOVE the viewport and fall as you scroll
        const initPixels = () => {
            pixelsRef.current = [];
            const pixelCount = window.innerWidth <= 668 ? 1200 : 2500; // More particles for density
            
            // Virtual height represents the "pool" of particles above the screen
            const virtualHeight = window.innerHeight * 1.5;
            
            for (let i = 0; i < pixelCount; i++) {
                // Generate Y position - concentrate MORE particles at top (will enter screen first)
                const randomY = Math.random();
                // Power < 1 creates top-heavy distribution (more particles near 0)
                const yPosition = Math.pow(randomY, 0.3) * virtualHeight;
                
                // X position is uniform across width
                const xPosition = Math.random() * canvas.width;
                
                // Density factor: higher for particles closer to top (low yPosition values)
                const densityFactor = 1 - (yPosition / virtualHeight);
                
                // Varied sizes - many small, fewer large
                const sizeRandom = Math.random();
                let baseSize;
                if (sizeRandom < 0.5) {
                    // Tiny particles (50%)
                    baseSize = 1 + Math.random() * 2;
                } else if (sizeRandom < 0.75) {
                    // Small particles (25%)
                    baseSize = 2.5 + Math.random() * 3;
                } else if (sizeRandom < 0.92) {
                    // Medium particles (17%)
                    baseSize = 5 + Math.random() * 6;
                } else {
                    // Large particles (8%)
                    baseSize = 10 + Math.random() * 12;
                }
                
                // Color palette: greens, blues, purples
                let hue;
                const colorType = Math.random();
                if (colorType < 0.45) {
                    // Green/Cyan range
                    hue = 140 + Math.random() * 60; // 140-200
                } else if (colorType < 0.75) {
                    // Blue range
                    hue = 200 + Math.random() * 60; // 200-260
                } else {
                    // Purple/Magenta range
                    hue = 260 + Math.random() * 50; // 260-310
                }
                
                const saturation = 40 + Math.random() * 45; // 40-85%
                const lightness = 35 + Math.random() * 35; // 35-70%
                
                pixelsRef.current.push({
                    baseX: xPosition,
                    // Start particles ABOVE the viewport
                    baseY: -yPosition,
                    x: xPosition,
                    y: -yPosition,
                    baseSize: baseSize,
                    opacity: 0,
                    targetOpacity: 0.4 + Math.random() * 0.5, // Varied opacity (0.4-0.9)
                    hovered: false,
                    pulsePhase: Math.random() * Math.PI * 2,
                    pulseSpeed: 0.005 + Math.random() * 0.015, // Very slow pulse
                    glowIntensity: 0,
                    densityFactor: densityFactor,
                    virtualHeight: virtualHeight,
                    hue: hue,
                    saturation: saturation,
                    lightness: lightness
                });
            }
        };
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPixels();
        };
        resizeCanvas();

        // Mouse move handler
        const handleMouseMove = (e) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        // Scroll handler
        const handleScroll = () => {
            scrollRef.current = window.pageYOffset;
        };

        // Animation loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scroll progress
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollRef.current / maxScroll, 1);
            
            // Calculate section progress
            const totalSections = 10;
            const currentSection = scrollProgress * (totalSections - 1);
            const portfolioSection = currentSection - 0.2;
            
            // SYNCED: Show only during outro section (7.0 to 10.9) - matches OutroEffect
            const outroThreshold = 7.0;
            const outroEnd = 10.9;
            
            // Calculate overall canvas opacity based on section
            let canvasOpacity = 0;
            if (portfolioSection >= outroThreshold && portfolioSection <= outroEnd) {
                canvasOpacity = 1;
            } else {
                canvasOpacity = 0;
            }
            
            // If canvas is invisible, skip rendering
            if (canvasOpacity <= 0) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            
            // Calculate outro progress for pixel animations (0 to 1 over the outro section)
            const outroProgress = Math.max(0, Math.min((portfolioSection - outroThreshold) / (outroEnd - outroThreshold), 1));
            
            // Calculate downward movement amount based on outro scroll progress
            const scrollAmount = outroProgress * 1.75;
            
            pixelsRef.current.forEach((pixel) => {
                // Calculate downward movement: particles fall from above the viewport
                const downwardMovement = scrollAmount * pixel.virtualHeight * 1.8;
                
                // New Y position after downward movement
                const newY = pixel.baseY + downwardMovement;
                
                // Pixel is visible when it's within the viewport
                const buffer = 200;
                const isInViewport = newY > -buffer && newY < canvas.height + buffer;
                
                // Calculate opacity based on visibility and canvas opacity
                if (isInViewport) {
                    // Smooth fade in as particle enters from top, full opacity in middle, fade out at bottom
                    let fadeInFactor = 1;
                    if (newY < buffer) {
                        // Entering from top - smooth fade in
                        fadeInFactor = Math.pow((newY + buffer) / buffer, 0.5);
                    } else if (newY > canvas.height - buffer) {
                        // Exiting from bottom - smooth fade out
                        fadeInFactor = Math.pow((canvas.height + buffer - newY) / buffer, 0.5);
                    }
                    
                    pixel.targetOpacity = (0.4 + Math.random() * 0.5) * canvasOpacity * fadeInFactor;
                } else {
                    pixel.targetOpacity = 0;
                }

                // Smooth opacity transition
                pixel.opacity += (pixel.targetOpacity - pixel.opacity) * 0.08;

                // Skip rendering if not visible enough
                if (pixel.opacity < 0.01) return;

                // Update pixel position
                pixel.x = pixel.baseX;
                pixel.y = newY;
                
                // Check hover distance
                const dx = mouseRef.current.x - pixel.x;
                const dy = mouseRef.current.y - pixel.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const hoverRadius = 120;
                
                pixel.hovered = distance < hoverRadius;

                // Update glow intensity
                if (pixel.hovered) {
                    pixel.glowIntensity = Math.min(pixel.glowIntensity + 0.1, 1);
                } else {
                    pixel.glowIntensity = Math.max(pixel.glowIntensity - 0.05, 0);
                }
                
                // Very gentle pulse effect
                pixel.pulsePhase += pixel.pulseSpeed;
                const pulseSize = Math.sin(pixel.pulsePhase) * 0.15; // Subtle size change
                const pulseOpacity = Math.sin(pixel.pulsePhase * 0.7) * 0.15 + 0.85; // Subtle opacity pulse

                // Draw clean particle without blur layers
                const currentSize = pixel.baseSize + pulseSize;
                const baseOpacity = pixel.opacity * pulseOpacity;
                
                // Single gradient particle - clean and crisp
                const particleGradient = ctx.createRadialGradient(
                    pixel.x, pixel.y, 0,
                    pixel.x, pixel.y, currentSize
                );

                if (pixel.hovered) {
                    // Bright white on hover
                    particleGradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity})`);
                    particleGradient.addColorStop(0.5, `rgba(240, 250, 255, ${baseOpacity * 0.7})`);
                    particleGradient.addColorStop(1, `rgba(220, 235, 255, 0)`);
                } else {
                    // Colorful particle
                    particleGradient.addColorStop(0, `hsla(${pixel.hue}, ${pixel.saturation + 10}%, ${Math.min(pixel.lightness + 35, 85)}%, ${baseOpacity})`);
                    particleGradient.addColorStop(0.5, `hsla(${pixel.hue}, ${pixel.saturation}%, ${pixel.lightness + 15}%, ${baseOpacity * 0.6})`);
                    particleGradient.addColorStop(1, `hsla(${pixel.hue}, ${pixel.saturation - 10}%, ${pixel.lightness}%, 0)`);
                }

                ctx.fillStyle = particleGradient;
                ctx.beginPath();
                ctx.arc(pixel.x, pixel.y, currentSize, 0, Math.PI * 2);
                ctx.fill();

                // Small bright highlight spot for depth
                if (!pixel.hovered && baseOpacity > 0.5) {
                    const spotRadius = currentSize * 0.35;
                    const spotGradient = ctx.createRadialGradient(
                        pixel.x - currentSize * 0.3, 
                        pixel.y - currentSize * 0.3, 
                        0,
                        pixel.x - currentSize * 0.3, 
                        pixel.y - currentSize * 0.3, 
                        spotRadius
                    );
                    
                    spotGradient.addColorStop(0, `rgba(255, 255, 255, ${baseOpacity * 0.7})`);
                    spotGradient.addColorStop(0.7, `rgba(255, 255, 255, ${baseOpacity * 0.3})`);
                    spotGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                    
                    ctx.fillStyle = spotGradient;
                    ctx.beginPath();
                    ctx.arc(
                        pixel.x - currentSize * 0.3, 
                        pixel.y - currentSize * 0.3, 
                        spotRadius, 
                        0, 
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Event listeners
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <canvas ref={canvasRef} className="outro-pixel-effect-canvas" />;
};

export default OutroPixelEffect;