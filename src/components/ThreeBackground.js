import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const mountNode = mountRef.current;
        let scene, camera, renderer, particles; // Removed globe
        let time = 0;
        let animationFrameId;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, mountNode.clientWidth / mountNode.clientHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
            renderer.setClearColor(0x000000, 0); // Transparent background
            mountNode.appendChild(renderer.domElement);
            
            camera.position.z = 25;

            createParticles();
            // Removed createGlobe();

            const ambientLight = new THREE.AmbientLight(0x5EEAD4, 0.5); // Teal ambient light
            scene.add(ambientLight);

            // Keeping one light for subtle effect on particles
            const directionalLight = new THREE.DirectionalLight(0xA78BFA, 0.5); // Violet directional light
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            animate();
        };

        const createParticles = () => {
            const particleCount = 800;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const radius = Math.random() * 40 + 10;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);
            }
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                size: 0.1,
                color: 0x94A3B8, // Slate color for particles
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);
        };

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            time += 0.003;

            if (particles) {
                particles.rotation.y = time * 0.3;
                // Add subtle movement to particles
                particles.geometry.attributes.position.array.forEach((val, i) => {
                    if (i % 3 === 0) { // X coordinate
                        particles.geometry.attributes.position.array[i] = val + Math.sin(time + i * 0.1) * 0.005;
                    }
                });
                particles.geometry.attributes.position.needsUpdate = true;
            }

            // Removed globe animation logic

            renderer.render(scene, camera);
        };

        const onWindowResize = () => {
            camera.aspect = mountNode.clientWidth / mountNode.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
        };

        init();
        window.addEventListener('resize', onWindowResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', onWindowResize);
            cancelAnimationFrame(animationFrameId);
            if (renderer) {
                renderer.dispose();
                if(mountNode && renderer.domElement){
                     mountNode.removeChild(renderer.domElement);
                }
            }
        };
    }, []);

    return <div id="canvas-container" ref={mountRef} />;
};

export default ThreeBackground;