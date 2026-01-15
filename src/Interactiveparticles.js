import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InteractiveParticles = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ============ CONFIGURATION ============
    const config = {
      particleCount: window.innerWidth <= 768 ? 5000 : 8000,
      spreadX: 200,                  // WIDE horizontal spread (full screen)
      spreadY: 200,                  // TALL vertical spread
      spreadZ: 200,                   // Depth spread
      particleSize: 0.95,            // Slightly larger for visibility
      goldColor: '#FFD700',          // Gold
      silverColor: '#C0C0C0',        // Silver
      opacity: 0.8,
      rotationSpeedY: 0.05,
      rotationSpeedZ: 0.02,
      mouseTiltStrength: 0.2,
      lerpSpeed: 0.1,
    };

    // ============ SCENE SETUP ============
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50; // Moved back to see full spread

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // ============ CREATE GOLD PARTICLES ============
    const createParticleSystem = (color, count, offsetY = 0) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);

      const virtualHeight = config.spreadY * 3; // Extended height for longer scroll

      for (let i = 0; i < count; i++) {
        // FULL SCREEN spread on X
        positions[i * 3] = (Math.random() - 0.5) * config.spreadX;
        
        // Z depth spread
        positions[i * 3 + 2] = (Math.random() - 0.5) * config.spreadZ;
        
        // Y: All particles start BELOW viewport
        // Power distribution = more particles near bottom (denser as you scroll)
        const yRandom = Math.pow(Math.random(), 0.5);
        positions[i * 3 + 1] = -virtualHeight * yRandom - config.spreadY / 2 + offsetY;

        // Random sizes for sparkle variety
        sizes[i] = 0.5 + Math.random() * 1.0;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Store base positions for scroll
      const basePositions = new Float32Array(positions);

      return { geometry, basePositions, virtualHeight };
    };

    // Create two particle systems - Gold and Silver
    const goldCount = Math.floor(config.particleCount / 2);
    const silverCount = config.particleCount - goldCount;

    const goldData = createParticleSystem(config.goldColor, goldCount, 0);
    const silverData = createParticleSystem(config.silverColor, silverCount, 10);

    // ============ SHINY GOLD MATERIAL ============
    const goldMaterial = new THREE.PointsMaterial({
      size: config.particleSize,
      color: new THREE.Color(config.goldColor),
      transparent: true,
      opacity: config.opacity,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // ============ SHINY SILVER MATERIAL ============
    const silverMaterial = new THREE.PointsMaterial({
      size: config.particleSize,
      color: new THREE.Color(config.silverColor),
      transparent: true,
      opacity: config.opacity,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create point meshes
    const goldPoints = new THREE.Points(goldData.geometry, goldMaterial);
    const silverPoints = new THREE.Points(silverData.geometry, silverMaterial);

    // Group them together for unified rotation
    const particleGroup = new THREE.Group();
    particleGroup.add(goldPoints);
    particleGroup.add(silverPoints);
    scene.add(particleGroup);

    // Add subtle lighting for shine effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // ============ STATE VARIABLES ============
    const mouse = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };
    let scrollY = 0;
    let animationId = null;
    const clock = new THREE.Clock();

    // ============ EVENT HANDLERS ============
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      }
    };

    const onScroll = () => {
      scrollY = window.pageYOffset;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // ============ ANIMATION LOOP ============
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      // Calculate scroll progress
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(scrollY / maxScroll, 1);
      const currentSection = scrollProgress * 9;

      // ========== EXTENDED VISIBILITY ==========
      // Visible from 0% to 80% of scroll (much longer!)
      // Logo: 0-55%, Mission: 55-85%
      const transitionStart = 0.70;  // Start fading later
      const transitionEnd = 0.90;    // Fade out slower

      let globalOpacity = config.opacity;
      if (currentSection < transitionStart) {
        globalOpacity = config.opacity;
      } else if (currentSection < transitionEnd) {
        const fadeProgress = (currentSection - transitionStart) / (transitionEnd - transitionStart);
        globalOpacity = config.opacity * Math.max(0, 1 - fadeProgress);
      } else {
        globalOpacity = 0;
      }

      goldMaterial.opacity = globalOpacity;
      silverMaterial.opacity = globalOpacity;

      // Skip rendering if invisible
      if (globalOpacity <= 0.01) {
        renderer.render(scene, camera);
        return;
      }

      // ========== SCROLL-BASED RISING ==========
      // EXTENDED scroll multiplier for longer particle travel
      const scrollAmount = scrollProgress * 4.0;
      
      // Update GOLD particles
      const goldPositionAttr = goldData.geometry.attributes.position;
      const goldUpward = scrollAmount * goldData.virtualHeight;
      
      for (let i = 0; i < goldCount; i++) {
        goldPositionAttr.array[i * 3] = goldData.basePositions[i * 3];
        goldPositionAttr.array[i * 3 + 2] = goldData.basePositions[i * 3 + 2];
        goldPositionAttr.array[i * 3 + 1] = goldData.basePositions[i * 3 + 1] + goldUpward;
      }
      goldPositionAttr.needsUpdate = true;

      // Update SILVER particles
      const silverPositionAttr = silverData.geometry.attributes.position;
      const silverUpward = scrollAmount * silverData.virtualHeight;
      
      for (let i = 0; i < silverCount; i++) {
        silverPositionAttr.array[i * 3] = silverData.basePositions[i * 3];
        silverPositionAttr.array[i * 3 + 2] = silverData.basePositions[i * 3 + 2];
        silverPositionAttr.array[i * 3 + 1] = silverData.basePositions[i * 3 + 1] + silverUpward;
      }
      silverPositionAttr.needsUpdate = true;

      // ========== TWINKLING EFFECT ==========
      // Animate particle sizes for sparkle
      const goldSizes = goldData.geometry.attributes.size;
      const silverSizes = silverData.geometry.attributes.size;
      
      for (let i = 0; i < goldCount; i++) {
        const twinkle = Math.sin(time * 3 + i * 0.1) * 0.3 + 0.7;
        goldSizes.array[i] = (0.5 + Math.sin(i) * 0.5) * twinkle;
      }
      goldSizes.needsUpdate = true;
      
      for (let i = 0; i < silverCount; i++) {
        const twinkle = Math.sin(time * 2.5 + i * 0.15) * 0.3 + 0.7;
        silverSizes.array[i] = (0.5 + Math.cos(i) * 0.5) * twinkle;
      }
      silverSizes.needsUpdate = true;

      // ========== ROTATION ==========
      const baseRotY = time * config.rotationSpeedY;
      const baseRotZ = time * config.rotationSpeedZ;

      // Mouse-based tilt
      const targetRotX = mouse.y * config.mouseTiltStrength;
      const targetRotY = mouse.x * config.mouseTiltStrength + baseRotY;

      currentRotation.x = THREE.MathUtils.lerp(currentRotation.x, targetRotX, config.lerpSpeed);
      currentRotation.y = THREE.MathUtils.lerp(currentRotation.y, targetRotY, config.lerpSpeed);

      particleGroup.rotation.x = currentRotation.x;
      particleGroup.rotation.y = currentRotation.y;
      particleGroup.rotation.z = baseRotZ;

      renderer.render(scene, camera);
    };

    // ============ START ============
    onScroll();
    animate();

    // ============ EVENT LISTENERS ============
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // ============ CLEANUP ============
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      goldData.geometry.dispose();
      silverData.geometry.dispose();
      goldMaterial.dispose();
      silverMaterial.dispose();
      renderer.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};

export default InteractiveParticles;