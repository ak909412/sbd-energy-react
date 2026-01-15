import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelCache from './modelCache';
import OutroPixelEffect from './OutroPixelEffect';
import './OutroEffect.css';
// import backgroundImage from './images/Bground.png';

const OutroEffect = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const modelRef = useRef(null);
    const particlesRef = useRef(null);
    const scrollRef = useRef(0);
    const animationFrameRef = useRef(null);
    const containerOpacityRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup - using texture background
        const scene = new THREE.Scene();
        
        // Load background texture using direct path
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
            `${process.env.PUBLIC_URL}/images/BGround.png`, // Direct path to public folder
            (texture) => {
                scene.background = texture;
            },
            undefined,
            (error) => {
                console.error('Error loading background texture:', error);
                // Fallback to solid color if texture fails to load
                scene.background = new THREE.Color(0x2a3d2a);
            }
        );
        
        scene.fog = new THREE.Fog(0x2a3d2a, 10, 50);
        sceneRef.current = scene;

        // Camera - same setup as logo section
        const isMobile = window.innerWidth <= 768;
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, isMobile ? 14 : 8);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: false,
            powerPreference: "high-performance"
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting - same as logo section
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(0, 8, 8);
        scene.add(spotLight);

        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
        frontLight.position.set(0, 0, 10);
        scene.add(frontLight);

        // Create particle system
        const createParticles = () => {
            const particleCount = 0;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Position in sphere
                const radius = Math.random() * 15 + 5;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                // Color (white/silvery to match logo section lighting)
                const colorVariation = Math.random() * 0.2;
                colors[i3] = 0.8 + colorVariation;     // R
                colors[i3 + 1] = 0.8 + colorVariation; // G
                colors[i3 + 2] = 0.8 + colorVariation; // B

                sizes[i] = Math.random() * 2 + 1;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    opacity: { value: 0 }
                },
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    uniform float time;
                    
                    void main() {
                        vColor = color;
                        vec3 pos = position;
                        
                        // Pulse effect
                        pos *= 1.0 + sin(time * 2.0 + position.x * 0.5) * 0.1;
                        
                        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                        gl_PointSize = size * (300.0 / -mvPosition.z);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    uniform float opacity;
                    
                    void main() {
                        // Circular particle
                        vec2 center = gl_PointCoord - 0.5;
                        float dist = length(center);
                        if (dist > 0.5) discard;
                        
                        float alpha = (1.0 - dist * 2.0) * opacity;
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `,
                transparent: true,
                vertexColors: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending
            });

            const particles = new THREE.Points(geometry, material);
            particles.visible = false;
            scene.add(particles);
            return particles;
        };

        particlesRef.current = createParticles();

        // Load logo model - same as logo section
        const loadModel = async () => {
            try {
                // Try to get cached logo model first
                const cachedModel = modelCache.logoModel;
                let model;

                if (cachedModel) {
                    model = cachedModel.clone();
                } else {
                    // Load logo.glb if not in cache
                    const loader = new GLTFLoader();
                    const gltf = await new Promise((resolve, reject) => {
                        loader.load(
                            `${process.env.PUBLIC_URL}/models/goldlogo.glb`,
                            resolve,
                            undefined,
                            reject
                        );
                    });
                    
                    model = gltf.scene;
                    modelCache.logoModel = model;
                }

                // FIXED: Create a wrapper group for proper center rotation
                const modelGroup = new THREE.Group();
                
                // Calculate bounding box BEFORE any transformations
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                
                // Scale the model
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 4 / maxDim;
                model.scale.setScalar(scale);

                // CRITICAL: Position the model so its CENTER is at the group's origin (0,0,0)
                // This ensures rotation happens around the visual center
                model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

                // Ensure materials are set up for proper rendering
                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.metalness = 0.3;
                            child.material.roughness = 0.4;
                        }
                    }
                });

                // Add model to the group
                modelGroup.add(model);
                
                // Position the group in the scene
                modelGroup.position.set(0, 0, 0);
                modelGroup.visible = false; // Start invisible
                
                // Add group to scene and store reference to GROUP (not model)
                scene.add(modelGroup);
                modelRef.current = modelGroup;

            } catch (error) {
                console.error('Error loading model:', error);
            }
        };

        loadModel();

        let currentIsMobile = window.innerWidth <= 768;
        let time = 0;
        const timeIncrement = 0.01;

        const handleScroll = () => {
            scrollRef.current = window.scrollY;
        };

        // Animation loop
        const animate = () => {
            time += timeIncrement;

            const scrollY = scrollRef.current;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;
            
            // Calculate scroll progress (0 to 1)
            const scrollProgress = Math.min(scrollY / maxScroll, 1);
            
            // Convert to section number (scale based on your total sections)
            // Outro starts at end of section 8 (8.95) going into section 9
            const totalSections = 10;
            const currentSection = scrollProgress * totalSections;
            const portfolioSection = currentSection;

            // Outro section spans from 8.95 to 10.0 (section 9)
            const outroStart = 7.5;
            const outroEnd = 10.0;
            const isOutroActive = portfolioSection >= outroStart && portfolioSection <= outroEnd;
            
            // Calculate progress through outro section (0 to 1)
            const outroProgress = isOutroActive 
                ? Math.min((portfolioSection - outroStart) / (outroEnd - outroStart), 1)
                : 0;

            // Fade in handling - start fade at 8.95, fully visible by 9.0
            if (isOutroActive) {
                const fadeInStart = 7.5;
                const fadeInEnd = 7.55;
                
                if (portfolioSection >= fadeInEnd) {
                    containerOpacityRef.current = Math.min(containerOpacityRef.current + 0.05, 1);
                } else {
                    // Gradual fade in between 8.95 and 9.0
                    const fadeProgress = (portfolioSection - fadeInStart) / (fadeInEnd - fadeInStart);
                    containerOpacityRef.current = fadeProgress;
                }
            } else {
                // Fade out when not in outro section
                containerOpacityRef.current = Math.max(containerOpacityRef.current - 0.05, 0);
            }
            
            // Apply opacity to container
            if (containerRef.current) {
                containerRef.current.style.opacity = containerOpacityRef.current;
            }

            if (isOutroActive && modelRef.current && particlesRef.current) {
                // FIXED: Model stays visible and rotates exactly 360 degrees throughout the ENTIRE section
                // The rotation now completes when outroProgress reaches 1.0
                
                // Complete 360-degree rotation (2π radians) over the entire section
                modelRef.current.rotation.y = outroProgress * Math.PI * 2;
                
                // Keep model visible throughout entire rotation
                modelRef.current.visible = true;
                
                // Subtle camera zoom during rotation
                const isMobile = window.innerWidth <= 768;
                const baseCameraZ = isMobile ? 14 : 8;
                camera.position.z = baseCameraZ - (outroProgress * 1.5);
                camera.lookAt(0, 0, 0);
                
                // Keep model fully opaque throughout
                modelRef.current.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.opacity = 1;
                        child.material.transparent = false;
                    }
                });
                
                // Optional: Add subtle particle effects at the end of rotation
                if (outroProgress > 0.85) {
                    const particleFade = (outroProgress - 0.85) / 0.15;
                    particlesRef.current.visible = true;
                    particlesRef.current.material.uniforms.opacity.value = particleFade * 0.3;
                    particlesRef.current.material.uniforms.time.value = time;
                    particlesRef.current.rotation.y = time * 0.2;
                } else {
                    particlesRef.current.visible = false;
                }
                
            } else {
                // Before/after outro section, keep model hidden
                if (modelRef.current) modelRef.current.visible = false;
                if (particlesRef.current) particlesRef.current.visible = false;
            }

            // Always render the scene
            renderer.render(scene, camera);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            const newIsMobile = window.innerWidth <= 768;
            currentIsMobile = newIsMobile;
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            camera.position.z = newIsMobile ? 14 : 8;
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <>
            {/* <OutroPixelEffect /> */}
            <div ref={containerRef} className="outro-canvas-container" />
        </>
    );
};

export default OutroEffect;