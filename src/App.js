import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import modelCache from './modelCache';
import './App.css';
import PixelEffect from './PixelEffect';
import InteractiveParticles from './Interactiveparticles';
import OutroEffect from './OutroEffect';
import backgroundImage from './BGround.png';
import ThreeBackground from './components/ThreeBackground';


const carouselData = [
    { title: "IT and Automation", subtitle: "Smart solutions for efficient operations", click: "Click To Know More", link: "/it", panelIndex: 0, bgVideo: '/videos/it.mp4', themeColor: 'rgba(139, 69, 19, 0.2)', hash: '#it', 
      colors: { base: '#8B4513', mid: '#A0522D', highlight: '#D2691E' } },
    { title: "Water Supply in Rural Area", subtitle: "Bringing clean water to communities", click: "Click To Know More", link: "/water", panelIndex: 1, bgVideo: '/videos/water.mp4', themeColor: 'rgba(30, 144, 255, 0.2)', hash: '#water',
      colors: { base: '#1E90FF', mid: '#4169E1', highlight: '#87CEEB' } },
    { title: "EV Charging", subtitle: "Powering the electric vehicle revolution", click: "Click To Know More", link: "/ev", panelIndex: 2, bgVideo: '/videos/ev.mp4', themeColor: 'rgba(50, 205, 50, 0.2)', hash: '#ev',
      colors: { base: '#32CD32', mid: '#3CB371', highlight: '#90EE90' } },
    { title: "Solar", subtitle: "Harnessing renewable energy for a sustainable future", click: "Click To Know More", link: "/solar", panelIndex: 3, bgVideo: '/videos/solar.mp4', themeColor: 'rgba(255, 165, 0, 0.2)', hash: '#solar',
      colors: { base: '#FFA500', mid: '#FFB347', highlight: '#FFD700' } },
    { title: "Film Production", subtitle: "Capturing stories that drive impact", click: "Click To Know More", link: "/film", panelIndex: 4, bgVideo: '/videos/film.mp4', themeColor: 'rgba(128, 0, 128, 0.2)', hash: '#film',
      colors: { base: '#800080', mid: '#9370DB', highlight: '#BA55D3' } },
    { title: "Branding", subtitle: "Building identities that inspire change", click: "Click To Know More", link: "/branding", panelIndex: 5, bgVideo: '/videos/branding.mp4', themeColor: 'rgba(220, 20, 60, 0.2)', hash: '#branding',
      colors: { base: '#DC143C', mid: '#FF1493', highlight: '#FF69B4' } }
];

// Generate client logos array (41 logos)
const clientLogos = Array.from({ length: 41 }, (_, i) => ({
    id: i + 1,
    name: `Client ${i + 1}`,
    logo: `/images/Clients/download (${i + 1}).png`
}));

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentHash, setCurrentHash] = useState('');
    const loadingState = useRef({ logo: 0, tree: 0 });

    // CRITICAL: Hide loading screen IMMEDIATELY on instant return + Handle transition overlay
    useEffect(() => {
        const instantReturn = sessionStorage.getItem('instantReturn');
        if (instantReturn === 'true') {
            console.log('⚡ INSTANT RETURN DETECTED - Hiding loading immediately');
            const loadingEl = document.querySelector('.loading-overlay');
            if (loadingEl) {
                loadingEl.style.display = 'none';
            }
            
            setTimeout(() => {
                const transitionOverlay = document.querySelector('.page-transition-overlay');
                if (transitionOverlay) {
                    console.log('🎬 Fading out transition overlay');
                    transitionOverlay.style.transition = 'opacity 0.5s ease-out';
                    transitionOverlay.style.opacity = '0';
                    
                    setTimeout(() => {
                        transitionOverlay.remove();
                        console.log('✅ Transition overlay removed');
                    }, 500);
                }
            }, 1000);
        }
    }, []);

    // TWINKLING EFFECT CONFIGURATION
    const twinkleConfig = {
        speed: 3,
        waveAmplitude: 0.15,
        randomAmplitude: 0.1,
        enabled: true
    };

    const logoCanvasContainer = useRef(null);
    const portfolioCanvasContainer = useRef(null);
    const carouselContainer = useRef(null);
    const progressFill = useRef(null);
    const scrollHint = useRef(null);
    const navigationButtons = useRef(null);
    const zoomOverlay = useRef(null);
    const loadingOverlay = useRef(null);
    const smokeyBgRef = useRef(null);
    const missionStatementRef = useRef(null);
    const clientsSectionRef = useRef(null);

    const threeStuff = useRef({
        logoScene: null, logoCamera: null, logoRenderer: null, logoModel: null,
        portfolioScene: null, portfolioCamera: null, portfolioRenderer: null, dnaModel: null,
        mouse: { x: 0, y: 0 },
        scrollY: 0,
        time: 0,
        targetRotation: new THREE.Vector3(),
        targetPosition: new THREE.Vector3(0, window.innerWidth <= 768 ? 0 : -4, 0),
        targetScale: window.innerWidth <= 768 ? 0.65 : 0.9,
        carouselPanels: [],
        panelStates: [],
        animationFrameId: null,
        isLoaded: false,
        scenesInitialized: false,
        treeHeight: 0,
        currentPanelIndex: -1,
        targetColors: {
            base: new THREE.Color('#059669'),
            mid: new THREE.Color('#10b981'),
            highlight: new THREE.Color('#6ee7b7')
        },
        currentColors: {
            base: new THREE.Color('#059669'),
            mid: new THREE.Color('#10b981'),
            highlight: new THREE.Color('#6ee7b7')
        },
        logoModelAdded: false,
        dnaModelAdded: false,
        displayedProgress: 0,
        progressAnimationId: null 
    }).current;

    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const getActivePanelIndex = useCallback((portfolioSection) => {
        return Math.round(portfolioSection);
    }, []);

    const updateTargetColors = useCallback((panelIndex) => {
        if (panelIndex < 0 || panelIndex >= carouselData.length) {
            threeStuff.targetColors.base.setHex(0x059669);
            threeStuff.targetColors.mid.setHex(0x10b981);
            threeStuff.targetColors.highlight.setHex(0x6ee7b7);
            return;
        }

        const panelColors = carouselData[panelIndex].colors;
        threeStuff.targetColors.base.set(panelColors.base);
        threeStuff.targetColors.mid.set(panelColors.mid);
        threeStuff.targetColors.highlight.set(panelColors.highlight);
        
        console.log(`🎨 Active panel: ${carouselData[panelIndex].title} - Colors updated to:`, panelColors);
    }, [threeStuff]);

    const applyModelColors = useCallback(() => {
        if (!threeStuff.dnaModel) return;

        const box = new THREE.Box3().setFromObject(threeStuff.dnaModel);
        const modelHeight = box.max.y - box.min.y;

        threeStuff.dnaModel.traverse((child) => {
            if (child.isMesh && child.material) {
                const normalizedY = (child.position.y - box.min.y) / modelHeight;
                const gradientFactor = Math.max(0, Math.min(1, normalizedY));

                let finalColor;
                if (gradientFactor < 0.5) {
                    finalColor = threeStuff.currentColors.base.clone().lerp(threeStuff.currentColors.mid, gradientFactor * 2);
                } else {
                    finalColor = threeStuff.currentColors.mid.clone().lerp(threeStuff.currentColors.highlight, (gradientFactor - 0.5) * 2);
                }

                child.material.color.copy(finalColor);
                child.material.emissive.copy(threeStuff.currentColors.mid);
                
                const baseEmissive = 0.3 + (gradientFactor * 0.25);
                
                if (twinkleConfig.enabled) {
                    const twinkle = Math.sin(threeStuff.time * twinkleConfig.speed + child.id) * twinkleConfig.waveAmplitude;
                    const randomTwinkle = (Math.random() - 0.5) * twinkleConfig.randomAmplitude;
                    child.material.emissiveIntensity = Math.max(0.1, baseEmissive + twinkle + randomTwinkle);
                } else {
                    child.material.emissiveIntensity = baseEmissive;
                }
                
                child.material.needsUpdate = true;
            }
        });
    }, [threeStuff, twinkleConfig]);

    const updateLoadingProgress = useCallback(() => {
        const totalProgress = Math.round((loadingState.current.logo + loadingState.current.tree) / 2);
        setLoadingProgress(totalProgress);
        console.log(`📊 Loading Progress - Logo: ${loadingState.current.logo}%, Tree: ${loadingState.current.tree}%, Total: ${totalProgress}%`);
    }, []);

    const updateSpiralCarousel = useCallback((currentSection) => {
        const isMobile = window.innerWidth <= 768;
        const radius = isMobile ? 350 : 700;
        const verticalSpacing = isMobile ? 120 : 150;
        const angularSpread = isMobile ? 1.2 : 0.80;

        threeStuff.panelStates.forEach((state, index) => {
            const panel = threeStuff.carouselPanels[index];
            if (!panel) return;

            const progress = index - currentSection;
            const angle = progress * angularSpread;
            const isVisible = currentSection >= -0.5 && currentSection <= 6 && Math.abs(progress) < 3;

            if (isVisible) {
                state.target = { x: Math.sin(angle) * radius, z: Math.cos(angle) * radius - (radius * 1.1), y: progress * verticalSpacing, rotY: angle, opacity: 1, scale: 1 };
                panel.style.pointerEvents = 'auto';
                panel.style.zIndex = Math.round(1000 + state.target.z);
                panel.style.cursor = 'pointer';
            } else {
                state.target = { ...state.target, opacity: 0, z: -2000, scale: 0.5 };
                panel.style.pointerEvents = 'none';
                panel.style.cursor = 'default';
            }
        });  
    }, [threeStuff]);

    const onScroll = useCallback(() => {
        threeStuff.scrollY = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(threeStuff.scrollY / maxScroll, 1);

        if (progressFill.current) {
            progressFill.current.style.width = `${scrollProgress * 100}%`;
        }

        const totalSections = 12;
        const currentSection = scrollProgress * (totalSections - 1);

        const logoEnd = 0.70;
        const missionStart = 0.70;
        const missionEnd = 0.88;
        const transitionStart = 0.88;
        const transitionEnd = 0.95;

        const logoCanvas = logoCanvasContainer.current;
        const portfolioCanvas = portfolioCanvasContainer.current;
        const carousel = carouselContainer.current;
        const smokeyBg = smokeyBgRef.current;
        const missionSection = missionStatementRef.current;
        const clientsSection = clientsSectionRef.current;
        const portfolioSection = currentSection - transitionEnd;

        const outroMessage = document.getElementById('outro-message');
        if (outroMessage) {
            if (portfolioSection > 7.3) {
                outroMessage.classList.add('visible');
            } else {
                outroMessage.classList.remove('visible');
            }
        }

        if (!logoCanvas || !portfolioCanvas || !carousel || !scrollHint.current || !navigationButtons.current || !missionSection) return;

        // ========== CLIENTS SECTION VISIBILITY ==========
        if (clientsSection) {
            if (portfolioSection >= 5.5 && portfolioSection <= 7.5) {
                const fadeInStart = 5.5;
                const fadeInEnd = 6.0;
                const fadeOutStart = 7.0;
                const fadeOutEnd = 7.5;
                
                let clientsOpacity = 0;
                
                if (portfolioSection >= fadeInStart && portfolioSection < fadeInEnd) {
                    clientsOpacity = (portfolioSection - fadeInStart) / (fadeInEnd - fadeInStart);
                } else if (portfolioSection >= fadeInEnd && portfolioSection <= fadeOutStart) {
                    clientsOpacity = 1;
                } else if (portfolioSection > fadeOutStart && portfolioSection <= fadeOutEnd) {
                    clientsOpacity = 1 - ((portfolioSection - fadeOutStart) / (fadeOutEnd - fadeOutStart));
                }
                
                clientsSection.style.opacity = String(clientsOpacity);
                clientsSection.style.visibility = clientsOpacity > 0.05 ? 'visible' : 'hidden';
            } else {
                clientsSection.style.opacity = '0';
                clientsSection.style.visibility = 'hidden';
            }
        }

        // ========== LOGO SECTION (0% to 70%) ==========
        if (currentSection < logoEnd) {
            logoCanvas.style.opacity = '1';
            logoCanvas.style.visibility = 'visible';
            logoCanvas.style.pointerEvents = 'auto';
            
            portfolioCanvas.style.opacity = '0';
            portfolioCanvas.style.visibility = 'hidden';
            portfolioCanvas.style.pointerEvents = 'none';
            
            carousel.style.opacity = '0';
            carousel.style.visibility = 'hidden';
            carousel.style.pointerEvents = 'none';
            
            missionSection.style.opacity = '0';
            missionSection.style.visibility = 'hidden';
            
            navigationButtons.current.style.opacity = '0';
            navigationButtons.current.style.pointerEvents = 'none';
            
            scrollHint.current.style.opacity = currentSection > 0.1 ? '1' : '0';
            
            if (smokeyBg) {
                smokeyBg.style.opacity = '0';
                smokeyBg.style.visibility = 'hidden';
            }
        }
        // ========== MISSION STATEMENT SECTION (70% to 88%) ==========
        else if (currentSection >= missionStart && currentSection < missionEnd) {
            const missionProgress = (currentSection - missionStart) / (missionEnd - missionStart);
            
            if (missionProgress < 0.10) {
                const logoFadeOut = 1 - (missionProgress / 0.10);
                logoCanvas.style.opacity = String(logoFadeOut);
                logoCanvas.style.visibility = logoFadeOut > 0.05 ? 'visible' : 'hidden';
            } else {
                logoCanvas.style.opacity = '0';
                logoCanvas.style.visibility = 'hidden';
            }
            logoCanvas.style.pointerEvents = 'none';
            
            if (missionProgress < 0.08) {
                const fadeIn = missionProgress / 0.08;
                missionSection.style.opacity = String(fadeIn);
                missionSection.style.visibility = 'visible';
            } else if (missionProgress > 0.92) {
                const fadeOut = 1 - ((missionProgress - 0.92) / 0.08);
                missionSection.style.opacity = String(fadeOut);
                missionSection.style.visibility = fadeOut > 0.05 ? 'visible' : 'hidden';
            } else {
                missionSection.style.opacity = '1';
                missionSection.style.visibility = 'visible';
            }
            
            portfolioCanvas.style.opacity = '0';
            portfolioCanvas.style.visibility = 'hidden';
            portfolioCanvas.style.pointerEvents = 'none';
            
            carousel.style.opacity = '0';
            carousel.style.visibility = 'hidden';
            carousel.style.pointerEvents = 'none';
            
            navigationButtons.current.style.opacity = '0';
            navigationButtons.current.style.pointerEvents = 'none';
            
            scrollHint.current.style.opacity = String(Math.max(0.3, 1 - missionProgress * 0.5));
            
            if (smokeyBg) {
                smokeyBg.style.opacity = '0';
                smokeyBg.style.visibility = 'hidden';
            }
        }
        // ========== TRANSITION TO PORTFOLIO (88% to 95%) ==========
        else if (currentSection >= transitionStart && currentSection < transitionEnd) {
            const transitionProgress = (currentSection - transitionStart) / (transitionEnd - transitionStart);
            const easeProgress = easeInOutCubic(transitionProgress);

            logoCanvas.style.opacity = '0';
            logoCanvas.style.visibility = 'hidden';
            logoCanvas.style.pointerEvents = 'none';
            
            missionSection.style.opacity = '0';
            missionSection.style.visibility = 'hidden';
            
            const portfolioOpacity = Math.min(1, easeProgress * 1.2);
            portfolioCanvas.style.opacity = String(portfolioOpacity);
            portfolioCanvas.style.visibility = portfolioOpacity > 0.1 ? 'visible' : 'hidden';
            portfolioCanvas.style.pointerEvents = 'auto';

            if (transitionProgress < 0.75) {
                carousel.style.opacity = '0';
                carousel.style.visibility = 'hidden';
                carousel.style.pointerEvents = 'none';
            } else {
                const carouselProgress = (transitionProgress - 0.75) / 0.25;
                carousel.style.opacity = String(carouselProgress * 0.8);
                carousel.style.visibility = 'visible';
                carousel.style.pointerEvents = 'auto';
            }

            navigationButtons.current.style.opacity = '0';
            navigationButtons.current.style.pointerEvents = 'none';
            
            scrollHint.current.style.opacity = String(Math.max(0.3, 1 - transitionProgress));

            if (smokeyBg) {
                if (transitionProgress > 0.7) {
                    const smokeProgress = (transitionProgress - 0.7) / 0.3;
                    smokeyBg.style.opacity = String(smokeProgress * 0.6);
                    smokeyBg.style.visibility = 'visible';
                } else {
                    smokeyBg.style.opacity = '0';
                    smokeyBg.style.visibility = 'hidden';
                }
            }

            if (transitionProgress > 0.75) {
                const earlyCarouselSection = ((transitionProgress - 0.75) / 0.25) * 0.3 - 0.5;
                updateSpiralCarousel(earlyCarouselSection);
            }

            if (threeStuff.dnaModel) {
                const dnaProgress = Math.max(0, transitionProgress - 0.2) / 0.8;
                threeStuff.targetRotation.set(0, dnaProgress * Math.PI * 0.5, 0);
            }
        }
        // ========== PORTFOLIO SECTION (95% onwards) ==========
        else {
            logoCanvas.style.opacity = '0';
            logoCanvas.style.visibility = 'hidden';
            logoCanvas.style.pointerEvents = 'none';
            
            missionSection.style.opacity = '0';
            missionSection.style.visibility = 'hidden';
            
            if (portfolioSection <= 7.0) {
                portfolioCanvas.style.opacity = '1';
                portfolioCanvas.style.visibility = 'visible';
                portfolioCanvas.style.pointerEvents = 'auto';
            } else if (portfolioSection > 7.0 && portfolioSection <= 7.2) {
                const fadeProgress = (portfolioSection - 7.0) / 0.2;
                const fadeOpacity = 1 - easeInOutCubic(fadeProgress);
                portfolioCanvas.style.opacity = String(fadeOpacity);
                portfolioCanvas.style.visibility = 'visible';
                portfolioCanvas.style.pointerEvents = 'none';
            } else {
                portfolioCanvas.style.opacity = '0';
                portfolioCanvas.style.visibility = 'hidden';
                portfolioCanvas.style.pointerEvents = 'none';
            }
            
            if (portfolioSection <= 7.0) {
                carousel.style.opacity = '1';
                carousel.style.visibility = 'visible';
                carousel.style.pointerEvents = 'auto';
            } else if (portfolioSection > 7.0 && portfolioSection <= 7.2) {
                const fadeProgress = (portfolioSection - 7.0) / 0.2;
                const fadeOpacity = 1 - easeInOutCubic(fadeProgress);
                carousel.style.opacity = String(fadeOpacity);
                carousel.style.visibility = 'visible';
                carousel.style.pointerEvents = 'none';
            } else {
                carousel.style.opacity = '0';
                carousel.style.visibility = 'hidden';
                carousel.style.pointerEvents = 'none';
            }

            if (smokeyBg) {
                if (portfolioSection <= 5.8) {
                    smokeyBg.style.opacity = '1';
                    smokeyBg.style.visibility = 'visible';
                } else {
                    smokeyBg.style.opacity = '0';
                    smokeyBg.style.visibility = 'hidden';
                }
            }

            if (portfolioSection >= 0 && portfolioSection <= 5.0) {
                navigationButtons.current.style.opacity = '1';
                navigationButtons.current.style.pointerEvents = 'auto';
                scrollHint.current.style.opacity = '0';
            } else if (portfolioSection > 5.0 && portfolioSection <= 5.5) {
                // Fade out navigation buttons before clients section
                const fadeProgress = (portfolioSection - 5.0) / 0.5;
                const fadeOpacity = 1 - easeInOutCubic(fadeProgress);
                navigationButtons.current.style.opacity = String(fadeOpacity);
                navigationButtons.current.style.pointerEvents = fadeOpacity > 0.1 ? 'auto' : 'none';
                scrollHint.current.style.opacity = '0';
            } else {
                navigationButtons.current.style.opacity = '0';
                navigationButtons.current.style.pointerEvents = 'none';
                
                if (portfolioSection < 0) {
                    scrollHint.current.style.opacity = '1';
                }
            }

            updateSpiralCarousel(portfolioSection);

            const activePanelIndex = getActivePanelIndex(portfolioSection);
            if (activePanelIndex !== threeStuff.currentPanelIndex) {
                threeStuff.currentPanelIndex = activePanelIndex;
                updateTargetColors(activePanelIndex);
            }

            if (threeStuff.dnaModel) {
                const portfolioProgress = Math.min(portfolioSection / 7.0, 1);
                const isMobile = window.innerWidth <= 768;
                
                const startY = isMobile ? 0 : -4;
                const travelDistance = isMobile ? 1.5 : 12;
                const targetY = startY + (portfolioProgress * travelDistance);

                threeStuff.targetPosition.set(0, targetY, 0);
                threeStuff.targetRotation.set(0, -portfolioSection * Math.PI * 1.5, 0);
                
                if (portfolioSection <= 7.0) {
                    threeStuff.targetScale = isMobile ? 0.65 : 0.9;
                } else if (portfolioSection > 7.0 && portfolioSection <= 7.2) {
                    const scaleProgress = (portfolioSection - 7.0) / 0.2;
                    const baseScale = isMobile ? 0.65 : 0.9;
                    threeStuff.targetScale = baseScale * (1 - easeInOutCubic(scaleProgress) * 0.3);
                }
            }
        }
    }, [threeStuff, updateSpiralCarousel, getActivePanelIndex, updateTargetColors]);

    const animate = useCallback(() => {
        threeStuff.animationFrameId = requestAnimationFrame(animate);
        threeStuff.time += 0.01;

        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(threeStuff.scrollY / maxScroll, 1);
        const currentSection = scrollProgress * 11; // totalSections - 1
        const logoEnd = 0.70;

        if (currentSection < logoEnd && threeStuff.logoModel && threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
            if (threeStuff.logoModel.scale.x < 0.99) {
                threeStuff.logoModel.scale.lerp(new THREE.Vector3(1, 1, 1), 0.03);
            }
            
            threeStuff.logoModel.rotation.y += 0.01;
            
            if (threeStuff.logoRenderer.domElement.parentNode) {
                threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
            }
        }
        
        if (!threeStuff.scenesInitialized) {
            return;
        }

        if (currentSection >= 0.7 && threeStuff.dnaModel && threeStuff.portfolioRenderer && threeStuff.portfolioScene) {
            threeStuff.dnaModel.rotation.y += (threeStuff.targetRotation.y - threeStuff.dnaModel.rotation.y) * 0.1;
            threeStuff.dnaModel.rotation.x += (threeStuff.targetRotation.x - threeStuff.dnaModel.rotation.x) * 0.1;
            const newScale = threeStuff.dnaModel.scale.x + (threeStuff.targetScale - threeStuff.dnaModel.scale.x) * 0.08;
            threeStuff.dnaModel.scale.set(newScale, newScale, newScale);
            threeStuff.dnaModel.rotation.y += threeStuff.mouse.x * 0.002;
            threeStuff.dnaModel.rotation.x += threeStuff.mouse.y * 0.002;

            threeStuff.dnaModel.position.lerp(threeStuff.targetPosition, 0.1);

            const colorLerpFactor = 0.05;
            threeStuff.currentColors.base.lerp(threeStuff.targetColors.base, colorLerpFactor);
            threeStuff.currentColors.mid.lerp(threeStuff.targetColors.mid, colorLerpFactor);
            threeStuff.currentColors.highlight.lerp(threeStuff.targetColors.highlight, colorLerpFactor);
            
            applyModelColors();

            if (threeStuff.portfolioRenderer.domElement.parentNode) {
                threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
            }
        }
        
        const smoothingFactor = 0.08;
        threeStuff.panelStates.forEach((state, index) => {
            const panel = threeStuff.carouselPanels[index];
            if (!panel) return;
            state.current.x += (state.target.x - state.current.x) * smoothingFactor;
            state.current.y += (state.target.y - state.current.y) * smoothingFactor;
            state.current.z += (state.target.z - state.current.z) * smoothingFactor;
            state.current.rotY += (state.target.rotY - state.current.rotY) * smoothingFactor;
            state.current.scale += (state.target.scale - state.current.scale) * smoothingFactor;
            state.current.opacity += (state.target.opacity - state.current.opacity) * smoothingFactor;
            if (state.current.opacity > 0.001) {
                panel.style.opacity = String(state.current.opacity);
                panel.style.transform = `translate(-50%, -50%) translate3d(${state.current.x}px, ${state.current.y}px, ${state.current.z}px) scale(${state.current.scale}) rotateY(${state.current.rotY}rad)`;
                panel.style.visibility = 'visible';
            } else {
                panel.style.visibility = 'hidden';
            }
        });
    }, [threeStuff, applyModelColors]);

    const handleHashNavigation = useCallback((hash) => {
        console.log('🔗 Navigating to hash:', hash);
        setCurrentHash(hash);

        const sectionId = hash.substring(1);

        const sectionPositions = {
            'it': 0.80,
            'water': 0.82,
            'ev': 0.84,
            'solar': 0.86,
            'film': 0.88,
            'branding': 0.90,
            'about': 0.92,
            'contact': 0.92,
            'achievement': 0.92,
            'awards': 0.92
        };

        const scrollProgress = sectionPositions[sectionId] || 0;
        const scrollY = scrollProgress * (document.body.scrollHeight - window.innerHeight);

        window.scrollTo({
            top: scrollY,
            behavior: 'smooth'
        });

        if (['it', 'water', 'ev', 'solar', 'film', 'branding'].includes(sectionId)) {
            const cardIndex = carouselData.findIndex(card => card.hash === hash);
            if (cardIndex !== -1) {
                setTimeout(() => {
                    updateSpiralCarousel(cardIndex);
                }, 300);
            }
        }
    }, [updateSpiralCarousel]);

    useEffect(() => {
        console.log('=== SESSION RESTORATION CHECK ===');
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        const returnHash = sessionStorage.getItem('currentHash');
        const returnScrollPosition = sessionStorage.getItem('scrollPosition') || sessionStorage.getItem('returnScrollPosition');
        const instantReturn = sessionStorage.getItem('instantReturn');

        console.log('From homepage:', fromHomepage);
        console.log('Return hash:', returnHash);
        console.log('Return scroll:', returnScrollPosition);
        console.log('Instant return:', instantReturn);
        console.log('Model cache loaded:', modelCache.isLoaded);

        if (instantReturn === 'true' && returnScrollPosition && location.pathname === '/') {
            console.log('⚡ INSTANT RETURN - Setting scroll immediately');
            
            window.scrollTo(0, parseInt(returnScrollPosition));
            
            setTimeout(() => {
                onScroll();
            }, 50);
            
            setTimeout(() => {
                sessionStorage.removeItem('instantReturn');
                sessionStorage.removeItem('fromHomepage');
                sessionStorage.removeItem('returnScrollPosition');
            }, 500);
        }
        else if (fromHomepage === 'true' && returnHash && location.pathname === '/') {
            const restoreDelay = modelCache.isLoaded ? 200 : 1200;
            
            setTimeout(() => {
                console.log('✅ Restoring position:', returnHash, returnScrollPosition);
                handleHashNavigation(returnHash);
                
                setTimeout(() => {
                    window.scrollTo({
                        top: parseInt(returnScrollPosition),
                        behavior: 'smooth'
                    });
                }, 500);
                
                setTimeout(() => {
                    sessionStorage.removeItem('fromHomepage');
                    sessionStorage.removeItem('returnScrollPosition');
                }, 1000);
            }, restoreDelay);
        } else {
            const initialHash = window.location.hash;
            if (initialHash) {
                setTimeout(() => {
                    console.log('🔗 Initial hash found:', initialHash);
                    handleHashNavigation(initialHash);
                }, 1000);
            }
        }

        const handlePopState = (event) => {
            console.log('⬅️ Browser back/forward button pressed');
            const hash = event.state?.hash || window.location.hash;
            if (hash) {
                handleHashNavigation(hash);
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [handleHashNavigation, location.pathname, onScroll]);

    useEffect(() => {
        console.log('=== APP COMPONENT MOUNTED ===');
        console.log('PUBLIC_URL:', process.env.PUBLIC_URL);
        console.log('Current pathname:', location.pathname);
        
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        
        const onMouseMove = (event) => {
            threeStuff.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            threeStuff.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };
        
        const onWindowResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const isMobile = width <= 768;
            
            if (threeStuff.logoCamera) {
                threeStuff.logoCamera.aspect = width / height;
                threeStuff.logoCamera.updateProjectionMatrix();
                threeStuff.logoCamera.position.z = isMobile ? 14 : 8;
                threeStuff.logoRenderer.setSize(width, height);
            }
            if (threeStuff.portfolioCamera) {
                threeStuff.portfolioCamera.aspect = width / height;
                threeStuff.portfolioCamera.fov = isMobile ? 65 : 50;
                threeStuff.portfolioCamera.updateProjectionMatrix();
                threeStuff.portfolioCamera.position.z = isMobile ? 20 : 10;
                threeStuff.portfolioRenderer.setSize(width, height);
                
                const startY = isMobile ? 0 : -4;
                threeStuff.targetPosition.y = startY;
                threeStuff.targetScale = isMobile ? 0.65 : 0.9;
            }
        };
        
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        const instantReturn = sessionStorage.getItem('instantReturn');
        
        if (instantReturn !== 'true' && fromHomepage !== 'true') {
            if (location.state?.scrollPosition) {
                window.scrollTo(0, location.state.scrollPosition);
            } else {
                window.scrollTo(0, 0);
            }
        }
        
        const initScenes = () => {
            console.log('=== INITIALIZING THREE.JS SCENES ===');

            if (logoCanvasContainer.current) {
                logoCanvasContainer.current.innerHTML = '';
            }
            if (portfolioCanvasContainer.current) {
                portfolioCanvasContainer.current.innerHTML = '';
            }
            
            threeStuff.logoModelAdded = false;
            threeStuff.dnaModelAdded = false;
            
            const hasModelsInCache = modelCache.isLoaded && modelCache.logoModel && modelCache.treeModel;
            const fromHomepage = sessionStorage.getItem('fromHomepage');
            const instantReturn = sessionStorage.getItem('instantReturn');
            const isReturning = fromHomepage === 'true' && hasModelsInCache;
            
            console.log('📦 Model cache status:', { 
                hasModelsInCache, 
                fromHomepage,
                instantReturn,
                isReturning,
                logoModelExists: !!modelCache.logoModel,
                treeModelExists: !!modelCache.treeModel
            });
            
            if (instantReturn === 'true') {
                console.log('⚡ INSTANT RETURN - Hiding loading overlay immediately');
                loadingState.current.logo = 100;
                loadingState.current.tree = 100;
                updateLoadingProgress();
                
                if (loadingOverlay.current) {
                    loadingOverlay.current.style.display = 'none';
                    console.log('✅ Loading overlay hidden for instant return');
                }
            }
            else if (isReturning) {
                console.log('🚀 INSTANT LOAD - Using cached models!');
                loadingState.current.logo = 100;
                loadingState.current.tree = 100;
                updateLoadingProgress();
                
                if (loadingOverlay.current) {
                    setTimeout(() => {
                        loadingOverlay.current.style.display = 'none';
                        console.log('✅ Loading overlay hidden after cache load');
                    }, 300);
                }
            } else {
                console.log('📥 FIRST LOAD - Showing loading progress');
                loadingState.current.logo = 0;
                loadingState.current.tree = 0;
                updateLoadingProgress();
            }
            
            if (!logoCanvasContainer.current || !portfolioCanvasContainer.current || !carouselContainer.current) {
                console.log('⏳ DOM elements not ready, retrying in 100ms...');
                setTimeout(initScenes, 100);
                return;
            }
            
            console.log('✅ All DOM elements ready');
            
            const isMobile = window.innerWidth <= 768;
            console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');
            
            // --- Logo Scene Setup ---
            threeStuff.logoScene = new THREE.Scene();
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(
                backgroundImage,
                (texture) => {
                    threeStuff.logoScene.background = texture;
                },
                undefined,
                (error) => { 
                    threeStuff.logoScene.background = new THREE.Color(0x000000); 
                }
            );
            threeStuff.logoCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            threeStuff.logoCamera.position.set(0, 0, isMobile ? 14 : 8);
            threeStuff.logoCamera.lookAt(0, 0, 0);
            
            threeStuff.logoRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            threeStuff.logoRenderer.setSize(window.innerWidth, window.innerHeight);
            threeStuff.logoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            threeStuff.logoRenderer.setClearColor(0x000000, 1);
            
            if (logoCanvasContainer.current) {
                logoCanvasContainer.current.appendChild(threeStuff.logoRenderer.domElement);
            }
            
            threeStuff.logoScene.add(new THREE.AmbientLight(0xffffff, 1.2));
            const spotLight = new THREE.SpotLight(0xffffff, 1.5);
            spotLight.position.set(0, 8, 8);
            threeStuff.logoScene.add(spotLight);
            
            const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
            frontLight.position.set(0, 0, 10);
            threeStuff.logoScene.add(frontLight);

            // --- Portfolio Scene Setup ---
            threeStuff.portfolioScene = new THREE.Scene();
            threeStuff.portfolioScene.fog = new THREE.Fog(0x000000, 20, 60);
            
            const fov = isMobile ? 65 : 50;
            threeStuff.portfolioCamera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
            threeStuff.portfolioCamera.position.set(0, 0, isMobile ? 20 : 10);
            
            threeStuff.portfolioRenderer = new THREE.WebGLRenderer({ 
                antialias: true, 
                alpha: true,
                premultipliedAlpha: false
            });
            threeStuff.portfolioRenderer.setSize(window.innerWidth, window.innerHeight);
            threeStuff.portfolioRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            threeStuff.portfolioRenderer.setClearColor(0x000000, 0);
            
            if (portfolioCanvasContainer.current) {
                portfolioCanvasContainer.current.appendChild(threeStuff.portfolioRenderer.domElement);
            }
            
            const pLights = {
                ambient: new THREE.AmbientLight(0x0a1810, 0.5),
                key: new THREE.DirectionalLight(0x10b981, 2.0),
                fill: new THREE.DirectionalLight(0x34d399, 0.8),
                rim: new THREE.SpotLight(0x059669, 1.5),
                accent1: new THREE.PointLight(0x6ee7b7, 0.6),
                accent2: new THREE.PointLight(0x10b981, 0.4)
            };

            pLights.key.position.set(5, 8, 5);
            pLights.key.castShadow = true;

            pLights.fill.position.set(-5, 3, -3);

            pLights.rim.position.set(0, 10, -10);
            pLights.rim.angle = Math.PI / 6;
            pLights.rim.penumbra = 0.5;
            pLights.rim.decay = 2;

            pLights.accent1.position.set(-8, 2, 5);
            pLights.accent1.distance = 25;
            pLights.accent1.decay = 2;

            pLights.accent2.position.set(8, -3, 3);
            pLights.accent2.distance = 20;
            pLights.accent2.decay = 2;

            threeStuff.portfolioScene.add(
                pLights.ambient,
                pLights.key,
                pLights.fill,
                pLights.rim,
                pLights.accent1,
                pLights.accent2
            );

            console.log('✅ Enhanced green-themed lighting setup complete');

            const applyVibrantShader = (model) => {
                console.log('🎨 Setting up model materials with vibrant greenish theme...');
                
                let meshCount = 0;
                const box = new THREE.Box3().setFromObject(model);
                const modelHeight = box.max.y - box.min.y;
                
                model.traverse((child) => {
                    if (child.isMesh) {
                        meshCount++;
                        
                        const normalizedY = (child.position.y - box.min.y) / modelHeight;
                        const gradientFactor = Math.max(0, Math.min(1, normalizedY));
                        
                        const baseColor = new THREE.Color('#059669');
                        const midColor = new THREE.Color('#10b981');
                        const highlightColor = new THREE.Color('#6ee7b7');
                        
                        let finalColor;
                        if (gradientFactor < 0.5) {
                            finalColor = baseColor.clone().lerp(midColor, gradientFactor * 2);
                        } else {
                            finalColor = midColor.clone().lerp(highlightColor, (gradientFactor - 0.5) * 2);
                        }
                        
                        child.material = new THREE.MeshStandardMaterial({
                            color: finalColor,
                            emissive: new THREE.Color('#10b981'),
                            emissiveIntensity: 0.3 + (gradientFactor * 0.25),
                            metalness: 0.4,
                            roughness: 0.25,
                            transparent: true,
                            opacity: 0.95,
                            side: THREE.DoubleSide
                        });
                        
                        child.material.needsUpdate = true;
                        
                        console.log('✅ Vibrant green material set for mesh:', child.name || `mesh_${meshCount}`);
                    }
                });
                
                console.log(`🎨 Material setup complete! Processed ${meshCount} meshes with vibrant green gradient.`);
                
                if (threeStuff.portfolioRenderer && threeStuff.portfolioScene && threeStuff.portfolioCamera) {
                    threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
                }
            };
            
            const finishLoading = () => {
                console.log('=== FINISHING LOADING ===');
                
                const delay = 800;
                
                setTimeout(() => {
                    if (loadingOverlay.current) {
                        loadingOverlay.current.classList.add('hidden');
                        console.log('✅ Loading overlay hidden');
                    }
                    
                    threeStuff.isLoaded = true;
                    sessionStorage.setItem('modelsLoaded', 'true');
                    
                    if (threeStuff.dnaModel && threeStuff.portfolioRenderer && threeStuff.portfolioScene) {
                        threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
                    }
                    
                    onScroll();
                }, delay);
            };

            const loadTreeModel = () => {
                if (hasModelsInCache && modelCache.treeModel) {
                    console.log('✅ Using CACHED tree model');
                    loadingState.current.tree = 50;
                    updateLoadingProgress();
                    
                    if (!threeStuff.dnaModelAdded) {
                        threeStuff.dnaModel = modelCache.treeModel.clone();
                        threeStuff.dnaModel.position.copy(threeStuff.targetPosition);
                        
                        if (threeStuff.portfolioScene) {
                            threeStuff.portfolioScene.add(threeStuff.dnaModel);
                            threeStuff.dnaModelAdded = true;
                            console.log('✅ Cached tree added to scene');
                        }
                        
                        setTimeout(() => {
                            applyVibrantShader(threeStuff.dnaModel);
                        }, 100);
                    } else {
                        console.log('⚠️ DNA model already added, skipping duplicate');
                    }
                    
                    finishLoading();
                    return;
                }
                
                console.log('=== LOADING TREE MODEL FROM FILE ===');
                
                const treeLoader = new GLTFLoader();
                treeLoader.load(
                    `${process.env.PUBLIC_URL}/models/DNA_9.glb`,
                    (gltf) => {
                        console.log('✅ Tree model loaded from file');
                        loadingState.current.tree = 50;
                        updateLoadingProgress();
                        
                        const treeModel = gltf.scene;
                        const box = new THREE.Box3().setFromObject(treeModel);
                        const size = box.getSize(new THREE.Vector3());
                        const center = box.getCenter(new THREE.Vector3());
                        
                        threeStuff.treeHeight = size.y;
                        treeModel.position.sub(center);
                        
                        const scaleFactor = isMobile ? 0.9 : 1.2;
                        const scale = scaleFactor / Math.max(...size.toArray());
                        treeModel.scale.set(scale, scale, scale);
                        
                        modelCache.treeModel = treeModel;
                        modelCache.isLoaded = true;
                        console.log('💾 Tree model CACHED in memory');
                        
                        if (!threeStuff.dnaModelAdded) {
                            threeStuff.dnaModel = treeModel.clone();
                            threeStuff.dnaModel.position.copy(threeStuff.targetPosition);
                            
                            if (threeStuff.portfolioScene) {
                                threeStuff.portfolioScene.add(threeStuff.dnaModel);
                                threeStuff.dnaModelAdded = true;
                                console.log('✅ Tree model added to scene');
                            }
                            
                            setTimeout(() => {
                                applyVibrantShader(threeStuff.dnaModel);
                            }, 100);
                        } else {
                            console.log('⚠️ DNA model already added, skipping duplicate');
                        }
                        
                        finishLoading();
                    },
                    (xhr) => {
                        if (xhr.lengthComputable && xhr.total > 0) {
                            const treeProgress = Math.round((xhr.loaded / xhr.total) * 50);
                            if (treeProgress !== loadingState.current.tree) {
                                loadingState.current.tree = treeProgress;
                                updateLoadingProgress();
                            }
                            console.log(`🌲 Tree loading: ${treeProgress}% (Total: ${loadingState.current.logo + treeProgress}%)`);
                        }
                    },
                    (error) => { 
                        console.error('❌ ERROR loading tree model:', error);
                        loadingState.current.tree = 50;
                        updateLoadingProgress();
                        
                        if (!threeStuff.dnaModelAdded) {
                            const geometry = new THREE.ConeGeometry(0.5, 2, 8);
                            const material = new THREE.MeshStandardMaterial({ color: 0x10b981 });
                            threeStuff.dnaModel = new THREE.Mesh(geometry, material);
                            
                            if (threeStuff.portfolioScene) {
                                threeStuff.portfolioScene.add(threeStuff.dnaModel);
                                threeStuff.dnaModelAdded = true;
                            }
                        } else {
                            console.log('⚠️ DNA model already added, skipping fallback');
                        }
                        
                        finishLoading();
                    }
                );
            };

            if (hasModelsInCache && modelCache.logoModel) {
                console.log('✅ Using CACHED logo model');
                loadingState.current.logo = 100;
                updateLoadingProgress();
                
                if (!threeStuff.logoModelAdded) {
                    threeStuff.logoModel = modelCache.logoModel.clone();
                    threeStuff.logoModel.scale.set(0.12, 0.12, 0.12);
                    threeStuff.logoScene.add(threeStuff.logoModel);
                    threeStuff.logoModelAdded = true;
                    console.log('✅ Cached logo added to scene');
                }
                
                threeStuff.scenesInitialized = true;
                
                if (threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
                    threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
                }
                
                loadTreeModel();
            } else {
                console.log('=== LOADING LOGO MODEL FROM FILE ===');
                const gltfLoader = new GLTFLoader();
                gltfLoader.load(`${process.env.PUBLIC_URL}/models/logoL.glb`,
                    (gltf) => {
                        console.log('✅ Logo model loaded from file');
                        loadingState.current.logo = 100;
                        updateLoadingProgress();
                        
                        const model = gltf.scene;
                        const box = new THREE.Box3().setFromObject(model);
                        const size = box.getSize(new THREE.Vector3());
                        const scale = 4 / Math.max(size.x, size.y, size.z);
                        model.scale.set(scale, scale, scale);
                        model.position.sub(box.getCenter(new THREE.Vector3()).multiplyScalar(scale));
                        
                        modelCache.logoModel = new THREE.Group();
                        modelCache.logoModel.add(model);
                        console.log('💾 Logo model CACHED in memory');
                        
                        if (!threeStuff.logoModelAdded) {
                            threeStuff.logoModel = modelCache.logoModel.clone();
                            threeStuff.logoModel.scale.set(0.25, 0.25, 0.25);
                            threeStuff.logoScene.add(threeStuff.logoModel);
                            threeStuff.logoModelAdded = true;
                            console.log('✅ Logo added to scene');
                        }
                        
                        if (threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
                            threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
                        }
                        
                        threeStuff.scenesInitialized = true;
                        
                        loadTreeModel();
                    },
                    (xhr) => {
                        if (xhr.lengthComputable && xhr.total > 0) {
                            const logoProgress = Math.round((xhr.loaded / xhr.total) * 50);
                            if (logoProgress !== loadingState.current.logo) {
                                loadingState.current.logo = logoProgress;
                                loadingState.current.tree = 0;
                                updateLoadingProgress();
                            }
                            console.log(`🎨 Logo loading: ${logoProgress}%`);
                        }
                    },
                    (error) => {
                        console.error('❌ ERROR loading logo model:', error);
                        loadingState.current.logo = 50;
                        updateLoadingProgress();
                        
                        const geometry = new THREE.IcosahedronGeometry(2.5, 1);
                        const material = new THREE.MeshStandardMaterial({ color: 0x10b981 });
                        
                        if (!threeStuff.logoModelAdded) {
                            threeStuff.logoModel = new THREE.Mesh(geometry, material);
                            threeStuff.logoModel.scale.set(0.25, 0.25, 0.25);
                            threeStuff.logoScene.add(threeStuff.logoModel);
                            threeStuff.logoModelAdded = true;
                        }
                        
                        if (threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
                            threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
                        }
                        
                        threeStuff.scenesInitialized = true;
                        
                        loadTreeModel();
                    }
                );
            }

            if (!carouselContainer.current) {
                setTimeout(initScenes, 100);
                return;
            }
            
            threeStuff.carouselPanels = Array.from(carouselContainer.current.children);
            threeStuff.panelStates = threeStuff.carouselPanels.map(() => ({
                target: { x: 0, y: 0, z: -2000, rotY: 0, scale: 1, opacity: 0 },
                current: { x: 0, y: 0, z: -2000, rotY: 0, scale: 1, opacity: 0 }
            }));
        };

        initScenes();
        
        setTimeout(() => {
            onScroll();
            onWindowResize();
        }, 50);
        
        animate();

        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('scroll', onScroll, { passive: true });
        
        if (instantReturn !== 'true') {
            window.scrollTo(0, 0);
        }

        return () => {
            cancelAnimationFrame(threeStuff.animationFrameId);
            window.removeEventListener('resize', onWindowResize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('scroll', onScroll);
            threeStuff.logoRenderer?.dispose();
            threeStuff.portfolioRenderer?.dispose();
            if (logoCanvasContainer.current) logoCanvasContainer.current.innerHTML = "";
            if (portfolioCanvasContainer.current) portfolioCanvasContainer.current.innerHTML = "";
        };
    }, [threeStuff, animate, onScroll, location, handleHashNavigation, updateLoadingProgress]);

    const zoomToService = useCallback((panel, link, index) => {
        const cardData = carouselData[index];
        const hash = cardData?.hash || '#it';
        const currentScrollY = window.scrollY;
        
        sessionStorage.setItem('lastPanelIndex', index);
        sessionStorage.setItem('scrollPosition', currentScrollY);
        sessionStorage.setItem('currentHash', hash);
        sessionStorage.setItem('fromHomepage', 'true');

        panel.style.setProperty('--panel-x', `${threeStuff.panelStates[index]?.current.x || 0}px`);
        panel.style.setProperty('--panel-y', `${threeStuff.panelStates[index]?.current.y || 0}px`);
        panel.style.setProperty('--panel-z', `${threeStuff.panelStates[index]?.current.z || 0}px`);
        panel.style.setProperty('--panel-rot', `${threeStuff.panelStates[index]?.current.rotY || 0}rad`);

        panel.classList.add('zooming');

        threeStuff.carouselPanels.forEach((p, i) => {
            if (i !== index) p.style.opacity = '0';
        });

        if (zoomOverlay.current) zoomOverlay.current.classList.add('active');

        setTimeout(() => {
            navigate(link, { 
                state: { 
                    returnHash: hash,
                    returnScrollPosition: currentScrollY,
                    fromHomepage: true
                } 
            });
        }, 800);
    }, [navigate, threeStuff, zoomOverlay]);

    const navigateToPage = useCallback((path) => {
        const currentScrollY = window.scrollY;
        
        sessionStorage.setItem('returnScrollPosition', currentScrollY);
        sessionStorage.setItem('currentHash', window.location.hash || '');
        sessionStorage.setItem('fromHomepage', 'true');
        sessionStorage.removeItem('scrollPosition');

        if (zoomOverlay.current) {
            zoomOverlay.current.classList.add('active');
        }

        setTimeout(() => {
            navigate(path, { 
                state: { 
                    returnScrollPosition: currentScrollY,
                    returnHash: window.location.hash || '',
                    fromHomepage: true,
                    scrollToTop: true
                } 
            });
        }, 400);
    }, [navigate, zoomOverlay]);

    return (
        <div className="App">
            <div 
                className="loading-overlay" 
                ref={loadingOverlay}
                style={{ 
                    display: sessionStorage.getItem('instantReturn') === 'true' ? 'none' : 'flex' 
                }}
            >
                <div className="loading-line"></div>
                <div className="loading-brand">SBD Energy</div>
                <div className="loading-subtitle">Sustainable Innovation</div>
                <div className="loading-progress">{loadingProgress}%</div>
            </div>

            <div className="zoom-overlay" ref={zoomOverlay}></div>
            <div className="progress-bar"><div className="progress-fill" ref={progressFill}></div></div>
            
            <div id="logo-canvas-container" ref={logoCanvasContainer}></div>
            <PixelEffect />
            
            {/* MISSION STATEMENT SECTION */}
            <div className="mission-statement-section" ref={missionStatementRef}>
                <div className="mission-content">
                    <div className="mission-decorator mission-decorator-top"></div>
                    <p className="mission-text">
                        <span className="mission-highlight">For over two decades,</span> SBD Group has been at the 
                        <span className="mission-highlight"> forefront of green innovation,</span> delivering 
                        <span className="mission-highlight"> transformative solutions</span> that uplift the most 
                        underserved communities, even in the <span className="mission-highlight">remotest and 
                        hardest-to-reach regions</span> of India.
                    </p>
                    <div className="mission-decorator mission-decorator-bottom"></div>
                    <div className="mission-particles">
                        {[...Array(20)].map((_, i) => (
                            <div key={i} className="mission-particle" style={{
                                '--particle-delay': `${i * 0.3}s`,
                                '--particle-duration': `${3 + Math.random() * 2}s`,
                                '--particle-x': `${Math.random() * 100}%`,
                                '--particle-y': `${Math.random() * 100}%`
                            }}></div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div id="portfolio-canvas-container" ref={portfolioCanvasContainer}></div>            
            <OutroEffect />
            
            <div className="scroll-hint" ref={scrollHint}>scroll to explore</div>
            
            <div className="carousel-container" ref={carouselContainer}>
                {carouselData.map((data, index) => (
                    <div
                        key={index}
                        className="carousel-panel"
                        data-index={index}
                        style={{
                            '--panel-bg-image': `url(${process.env.PUBLIC_URL}${data.bgImage})`,
                            '--panel-theme-color': data.themeColor
                        }}
                        onClick={(e) => zoomToService(e.currentTarget, data.link, index)}
                    >
                        <video
                            className="panel-video-background"
                            src={`${process.env.PUBLIC_URL}${data.bgVideo}`}
                            autoPlay
                            loop
                            muted
                            playsInline
                            ref={el => {
                                if (el) el.playbackRate = 1.5;
                            }}
                        />
                        <img
                            src={`${process.env.PUBLIC_URL}/images/Bakingnormal.png`}
                            alt="Noise overlay"
                            className="panel-noise-overlay"
                        />
                        <div className="medium-text">{data.title}</div>
                        <div className="subtitle">{data.subtitle}</div>
                        <div className='click'>{data.click}</div>
                    </div>
                ))}
            </div>

            {/* CLIENTS SECTION - Horizontal Marquee */}
            <div className="clients-section" ref={clientsSectionRef}>
                <div className="clients-container">
                    <h2 className="clients-title">Our Trusted Partners</h2>
                    <p className="clients-subtitle">Collaborating with industry leaders across India</p>
                    
                    {/* First Marquee Row - Left to Right */}
                    <div className="clients-marquee-wrapper">
                        <div className="clients-marquee clients-marquee-left">
                            <div className="clients-marquee-content">
                                {[...clientLogos.slice(0, 21), ...clientLogos.slice(0, 21)].map((client, index) => (
                                    <div key={`row1-${index}`} className="client-logo-item">
                                        <img 
                                            src={`${process.env.PUBLIC_URL}${client.logo}`} 
                                            alt={client.name}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Second Marquee Row - Right to Left */}
                    <div className="clients-marquee-wrapper">
                        <div className="clients-marquee clients-marquee-right">
                            <div className="clients-marquee-content">
                                {[...clientLogos.slice(21, 41), ...clientLogos.slice(21, 41)].map((client, index) => (
                                    <div key={`row2-${index}`} className="client-logo-item">
                                        <img 
                                            src={`${process.env.PUBLIC_URL}${client.logo}`} 
                                            alt={client.name}
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="navigation-buttons" ref={navigationButtons}>
                <button className="nav-button" onClick={() => navigateToPage('/about')}>About</button>
                <button className="nav-button" onClick={() => navigateToPage('/awards')}>Achievements</button>
                <button className="nav-button" onClick={() => navigateToPage('/press')}>Press</button>
                <button className="nav-button" onClick={() => navigateToPage('/social')}>SocialWelfare</button>
                <button className="nav-button" onClick={() => navigateToPage('/contact')}>Contact</button>
            </div>

            <div className="content">
                {[...Array(12)].map((_, i) => <section key={i} className="section" id={i === 10 ? 'footer' : undefined}></section>)}
            </div>
        </div>
    );
}

export default App;