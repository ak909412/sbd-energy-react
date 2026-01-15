import React, { useEffect, useRef } from 'react';
import './PixelEffect.css';

const PixelEffect = () => {
    const canvasRef = useRef(null);
    const pixelsRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const animationFrameRef = useRef(null);
    const timeRef = useRef(0);
    const texturesRef = useRef({ gold: null, silver: null, loaded: false });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // ✨ Load texture images for particles
        const loadTextures = () => {
            return new Promise((resolve) => {
                let loadedCount = 0;
                const totalTextures = 2;
                
                const goldImg = new Image();
                const silverImg = new Image();
                
                const checkLoaded = () => {
                    loadedCount++;
                    if (loadedCount === totalTextures) {
                        texturesRef.current.gold = goldImg;
                        texturesRef.current.silver = silverImg;
                        texturesRef.current.loaded = true;
                        console.log('✅ Textures loaded successfully');
                        resolve();
                    }
                };
                
                goldImg.onload = checkLoaded;
                silverImg.onload = checkLoaded;
                
                goldImg.onerror = () => {
                    console.warn('⚠️ Gold texture failed to load, using fallback colors');
                    checkLoaded();
                };
                
                silverImg.onerror = () => {
                    console.warn('⚠️ Silver texture failed to load, using fallback colors');
                    checkLoaded();
                };
                
                // Load images from public folder
                goldImg.src = `${process.env.PUBLIC_URL || ''}/gold.jpg`;
                silverImg.src = `${process.env.PUBLIC_URL || ''}/silver.jpg`;
            });
        };
        
        // Initialize pixels - ALL start BELOW the viewport and rise as you scroll
        const initPixels = () => {
            pixelsRef.current = [];
            const pixelCount = window.innerWidth <= 768 ? 1000 : 7000;
            
            // Larger virtual height for better spread
            const virtualHeight = window.innerHeight * 2.0;
            
            for (let i = 0; i < pixelCount; i++) {
                // Generate Y position - more spread out distribution
                const randomY = Math.random();
                const yPosition = Math.pow(randomY, 0.2) * virtualHeight;
                
                // X position is uniform across width
                const xPosition = Math.random() * canvas.width;
                
                // Density factor: higher for particles closer to bottom
                const densityFactor = 1 - (yPosition / virtualHeight);
                
                // ✨ INCREASED particle sizes for more visibility
                const baseSizeMin = 4;
                const baseSizeRange = 3;
                
                // ✨ RANDOM DISTRIBUTION: 50% gold, 50% silver - completely mixed
                const colorType = Math.random() < 0.5 ? 'golden' : 'silver';
                
                // Random texture offset for variety (different parts of the texture image)
                const textureOffsetX = Math.random();
                const textureOffsetY = Math.random();
                
                // ✨ Twinkling parameters - MORE VISIBLE and ATTENTION-GRABBING
                const twinkleSpeed = 0.8 + Math.random() * 1.5;
                const twinklePhase = Math.random() * Math.PI * 2;
                const twinkleIntensity = 0.6 + Math.random() * 0.4;
                
                pixelsRef.current.push({
                    baseX: xPosition,
                    baseY: canvas.height + yPosition,
                    x: xPosition,
                    y: canvas.height + yPosition,
                    baseSize: Math.random() * baseSizeRange + baseSizeMin,
                    opacity: 0,
                    targetOpacity: (Math.random() * 0.4 + 0.5) * (0.4 + densityFactor * 0.6),
                    hovered: false,
                    pulsePhase: Math.random() * Math.PI * 2,
                    glowIntensity: 0,
                    densityFactor: densityFactor,
                    virtualHeight: virtualHeight,
                    colorType: colorType,
                    textureOffsetX: textureOffsetX,
                    textureOffsetY: textureOffsetY,
                    // Twinkling properties
                    twinkleSpeed: twinkleSpeed,
                    twinklePhase: twinklePhase,
                    twinkleIntensity: twinkleIntensity,
                    twinkleBrightness: 1.0
                });
            }
        };
        
        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPixels();
        };

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
            timeRef.current += 0.016;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate scroll progress
            const maxScroll = document.body.scrollHeight - window.innerHeight;
            const scrollProgress = Math.min(scrollRef.current / maxScroll, 1);
            
            const totalSections = 9;
            const currentSection = scrollProgress * (totalSections - 1);
            
            const transitionStart = 0.45;
            const transitionEnd = 0.75;
            
            // Calculate canvas opacity
            let canvasOpacity = 1;
            if (currentSection < transitionStart) {
                canvasOpacity = 1;
            } else if (currentSection >= transitionStart && currentSection < transitionEnd) {
                const transitionProgress = (currentSection - transitionStart) / (transitionEnd - transitionStart);
                canvasOpacity = Math.max(0, 1 - (transitionProgress * 1.5));
            } else {
                canvasOpacity = 0;
            }
            
            if (canvasOpacity <= 0.01) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            
            const scrollAmount = scrollProgress * 5.0;
            
            pixelsRef.current.forEach((pixel) => {
                // ✨ UPDATE TWINKLING
                pixel.twinklePhase += pixel.twinkleSpeed * 0.05;
                
                const twinkle1 = Math.sin(pixel.twinklePhase) * 0.5 + 0.5;
                const twinkle2 = Math.sin(pixel.twinklePhase * 1.7 + 1.3) * 0.5 + 0.5;
                const twinkle3 = Math.sin(pixel.twinklePhase * 2.3 + 2.7) * 0.5 + 0.5;
                
                const combinedTwinkle = (twinkle1 * 0.5 + twinkle2 * 0.3 + twinkle3 * 0.2);
                pixel.twinkleBrightness = 0.3 + (combinedTwinkle * pixel.twinkleIntensity * 1.5);
                
                const upwardMovement = scrollAmount * pixel.virtualHeight * 2;
                const newY = pixel.baseY - upwardMovement;
                
                const buffer = 200;
                const isInViewport = newY > -buffer && newY < canvas.height + buffer;
                
                if (isInViewport) {
                    let fadeInFactor = 1;
                    if (newY > canvas.height - buffer) {
                        fadeInFactor = Math.pow((canvas.height + buffer - newY) / buffer, 0.5);
                    } else if (newY < buffer) {
                        fadeInFactor = Math.pow((newY + buffer) / buffer, 0.5);
                    }
                    
                    pixel.targetOpacity = (Math.random() * 0.2 + 0.8) * canvasOpacity * fadeInFactor;
                } else {
                    pixel.targetOpacity = 0;
                }

                pixel.opacity += (pixel.targetOpacity - pixel.opacity) * 0.12;

                if (pixel.opacity < 0.01) return;

                pixel.x = pixel.baseX;
                pixel.y = newY;
                
                const dx = mouseRef.current.x - pixel.x;
                const dy = mouseRef.current.y - pixel.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const hoverRadius = 80;
                
                pixel.hovered = distance < hoverRadius;

                if (pixel.hovered) {
                    pixel.glowIntensity = Math.min(pixel.glowIntensity + 0.15, 1);
                } else {
                    pixel.glowIntensity = Math.max(pixel.glowIntensity - 0.08, 0);
                }
                
                pixel.pulsePhase += 0.01;
                const pulseSize = Math.sin(pixel.pulsePhase) * 0.1;

                // ✨ DRAW TEXTURE-BASED PARTICLE
                const currentSize = pixel.baseSize + pulseSize;
                const twinkledOpacity = pixel.opacity * pixel.twinkleBrightness;
                
                // Save context state
                ctx.save();
                
                // Create circular clipping path for sharp edges
                ctx.beginPath();
                ctx.arc(pixel.x, pixel.y, currentSize, 0, Math.PI * 2);
                ctx.clip();
                
                if (pixel.hovered) {
                    // Darken on hover
                    ctx.globalAlpha = twinkledOpacity;
                    ctx.fillStyle = '#1a1a1a';
                    ctx.fill();
                } else if (texturesRef.current.loaded) {
                    // ✨ USE TEXTURE IMAGE
                    const texture = pixel.colorType === 'golden' ? texturesRef.current.gold : texturesRef.current.silver;
                    
                    if (texture && texture.complete && texture.naturalWidth > 0) {
                        ctx.globalAlpha = twinkledOpacity;
                        
                        // Sample a portion of the texture based on offset
                        const textureSize = Math.min(texture.width, texture.height);
                        const sampleSize = textureSize * 0.3; // Use 30% of texture
                        const sx = pixel.textureOffsetX * (texture.width - sampleSize);
                        const sy = pixel.textureOffsetY * (texture.height - sampleSize);
                        
                        // Draw texture within the circular clip
                        ctx.drawImage(
                            texture,
                            sx, sy, sampleSize, sampleSize, // Source
                            pixel.x - currentSize, pixel.y - currentSize, 
                            currentSize * 2, currentSize * 2 // Destination
                        );
                    } else {
                        // Fallback to gradient if texture not ready
                        drawFallbackGradient(ctx, pixel, currentSize, twinkledOpacity);
                    }
                } else {
                    // Fallback to gradient while textures load
                    drawFallbackGradient(ctx, pixel, currentSize, twinkledOpacity);
                }
                
                ctx.restore();
                
                // ✨ ENHANCED SPECULAR HIGHLIGHT for glossiness
                if (!pixel.hovered && pixel.twinkleBrightness > 0.7) {
                    const highlightSize = currentSize * 0.4;
                    const highlightOpacity = twinkledOpacity * Math.min((pixel.twinkleBrightness - 0.7) * 2.5, 1);
                    
                    const highlightGradient = ctx.createRadialGradient(
                        pixel.x - currentSize * 0.35,
                        pixel.y - currentSize * 0.35,
                        0,
                        pixel.x - currentSize * 0.35,
                        pixel.y - currentSize * 0.35,
                        highlightSize
                    );
                    
                    highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${highlightOpacity * 0.8})`);
                    highlightGradient.addColorStop(0.4, `rgba(255, 255, 255, ${highlightOpacity * 0.4})`);
                    highlightGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
                    
                    ctx.fillStyle = highlightGradient;
                    ctx.beginPath();
                    ctx.arc(
                        pixel.x - currentSize * 0.35,
                        pixel.y - currentSize * 0.35,
                        highlightSize,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        // ✨ Fallback gradient function
        const drawFallbackGradient = (ctx, pixel, currentSize, opacity) => {
            const gradient = ctx.createRadialGradient(
                pixel.x - currentSize * 0.3,
                pixel.y - currentSize * 0.3,
                0,
                pixel.x,
                pixel.y,
                currentSize
            );
            
            if (pixel.colorType === 'golden') {
                gradient.addColorStop(0, `rgba(255, 245, 200, ${opacity})`);
                gradient.addColorStop(0.35, `rgba(255, 230, 100, ${opacity})`);
                gradient.addColorStop(0.65, `rgba(255, 215, 0, ${opacity})`);
                gradient.addColorStop(1, `rgba(184, 134, 11, ${opacity * 0.95})`);
            } else {
                gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                gradient.addColorStop(0.35, `rgba(242, 242, 242, ${opacity})`);
                gradient.addColorStop(0.65, `rgba(192, 192, 192, ${opacity})`);
                gradient.addColorStop(1, `rgba(128, 128, 128, ${opacity * 0.95})`);
            }
            
            ctx.globalAlpha = 1;
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, currentSize, 0, Math.PI * 2);
            ctx.fill();
        };

        // Initialize
        const init = async () => {
            resizeCanvas();
            await loadTextures();
            animate();
        };

        init();

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

    return <canvas ref={canvasRef} className="pixel-effect-canvas" />;
};

export default PixelEffect;