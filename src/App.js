import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {SmokeyCursor} from './SmokeyCursor';
import modelCache from './modelCache';
import treeTextureImage from './tree.jpg';
import './App.css';

const carouselData = [
    { title: "Solar", subtitle: "Harnessing renewable energy for a sustainable future", click: "Click To Know More", link: "/solar", panelIndex: 0, bgVideo: '/videos/solar.mp4', themeColor: 'rgba(255, 165, 0, 0.2)', hash: '#solar' },
    { title: "Water Supply in Rural Area", subtitle: "Bringing clean water to communities", click: "Click To Know More", link: "/water", panelIndex: 1, bgVideo: '/videos/water.mp4', themeColor: 'rgba(30, 144, 255, 0.2)', hash: '#water' },
    { title: "EV Charging", subtitle: "Powering the electric vehicle revolution", click: "Click To Know More", link: "/ev", panelIndex: 2, bgVideo: '/videos/ev.mp4', themeColor: 'rgba(50, 205, 50, 0.2)', hash: '#ev' },
    { title: "Branding", subtitle: "Building identities that inspire change", click: "Click To Know More", link: "/branding", panelIndex: 3, bgVideo: '/videos/branding.mp4', themeColor: 'rgba(220, 20, 60, 0.2)', hash: '#branding' },
    { title: "IT and Automation", subtitle: "Smart solutions for efficient operations", click: "Click To Know More", link: "/it", panelIndex: 4, bgVideo: '/videos/it.mp4', themeColor: 'rgba(139, 69, 19, 0.2)', hash: '#it' },
    { title: "Film Production", subtitle: "Capturing stories that drive impact", click: "Click To Know More", link: "/film", panelIndex: 5, bgVideo: '/videos/film.mp4', themeColor: 'rgba(128, 0, 128, 0.2)', hash: '#film' }
];

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentHash, setCurrentHash] = useState('');

    const logoCanvasContainer = useRef(null);
    const portfolioCanvasContainer = useRef(null);
    const carouselContainer = useRef(null);
    const progressFill = useRef(null);
    const scrollHint = useRef(null);
    const navigationButtons = useRef(null);
    const zoomOverlay = useRef(null);
    const loadingOverlay = useRef(null);
    const smokeyBgRef = useRef(null);

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
    }).current;

    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const updateSpiralCarousel = useCallback((currentSection) => {
        const isMobile = window.innerWidth <= 768;
        const radius = isMobile ? 350 : 700;
        const verticalSpacing = isMobile ? 120 : 150;
        const angularSpread = isMobile ? 1.0 : 0.75;

        threeStuff.panelStates.forEach((state, index) => {
            const panel = threeStuff.carouselPanels[index];
            if (!panel) return;

            const progress = index - currentSection;
            const angle = progress * angularSpread;
            const isVisible = currentSection >= -0.5 && currentSection <= 6 && Math.abs(progress) < 3;

            if (isVisible) {
                state.target = { x: Math.sin(angle) * radius, z: Math.cos(angle) * radius - (radius * 1.1), y: progress * verticalSpacing, rotY: angle, opacity: 1, scale: 1 };
                panel.style.pointerEvents = (Math.abs(angle) < 0.3 && Math.abs(progress) < 0.5) ? 'auto' : 'none';
                panel.style.zIndex = Math.round(1000 + state.target.z);
            } else {
                state.target = { ...state.target, opacity: 0, z: -2000, scale: 0.5 };
                panel.style.pointerEvents = 'none';
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

        const totalSections = 9;
        const currentSection = scrollProgress * (totalSections - 1);

        const transitionStart = 0.4;
        const transitionEnd = 1.2;

        const logoCanvas = logoCanvasContainer.current;
        const portfolioCanvas = portfolioCanvasContainer.current;
        const carousel = carouselContainer.current;
        const smokeyBg = smokeyBgRef.current;

        if (!logoCanvas || !portfolioCanvas || !carousel || !scrollHint.current || !navigationButtons.current) return;

        if (currentSection < transitionStart) {
            logoCanvas.style.opacity = '1';
            portfolioCanvas.style.opacity = '0';
            carousel.style.opacity = '0';
            navigationButtons.current.style.opacity = '0';
            scrollHint.current.style.opacity = currentSection > 0.1 ? '1' : '0';
            if (smokeyBg) smokeyBg.style.opacity = '0';
        } else if (currentSection >= transitionStart && currentSection < transitionEnd) {
            const transitionProgress = (currentSection - transitionStart) / (transitionEnd - transitionStart);
            const easeProgress = easeInOutCubic(transitionProgress);

            logoCanvas.style.opacity = String(1 - easeProgress);
            portfolioCanvas.style.opacity = String(easeProgress);

            const carouselFadeStart = 0.3;
            const carouselOpacity = transitionProgress < carouselFadeStart ? 0 : Math.min(1, (transitionProgress - carouselFadeStart) / (1 - carouselFadeStart));
            carousel.style.opacity = String(carouselOpacity * 0.8);

            navigationButtons.current.style.opacity = '0';
            scrollHint.current.style.opacity = String(Math.max(0.3, 1 - transitionProgress));

            if (smokeyBg) {
                const smokeFadeStart = 0.5;
                const smokeOpacity = transitionProgress < smokeFadeStart ? 0 : Math.min(1, (transitionProgress - smokeFadeStart) / (1 - smokeFadeStart));
                smokeyBg.style.opacity = String(smokeOpacity);
            }

            const earlyCarouselSection = ((transitionProgress - 0.3) / 0.7) * 0.5 - 0.5;
            if (earlyCarouselSection > 0) updateSpiralCarousel(earlyCarouselSection);

            if (threeStuff.dnaModel) {
                const dnaProgress = Math.max(0, transitionProgress - 0.2) / 0.8;
                threeStuff.targetRotation.set(0, dnaProgress * Math.PI * 0.5, 0);
            }
        } else {
            logoCanvas.style.opacity = '0';
            portfolioCanvas.style.opacity = '1';
            scrollHint.current.style.opacity = '1';
            carousel.style.opacity = '1';

            const portfolioSection = currentSection - transitionEnd;

            if (smokeyBg) {
                if (portfolioSection <= 5.8) {
                    smokeyBg.style.opacity = '1';
                } else {
                    smokeyBg.style.opacity = '0';
                }
            }

            if (portfolioSection > 5.8) {
                navigationButtons.current.style.opacity = '1';
                navigationButtons.current.style.pointerEvents = 'auto';
                scrollHint.current.style.opacity = '0';
            } else {
                navigationButtons.current.style.opacity = '0';
                navigationButtons.current.style.pointerEvents = 'none';
            }

            updateSpiralCarousel(portfolioSection);

            if (threeStuff.dnaModel) {
                const portfolioProgress = Math.min(portfolioSection / 6, 1);
                const isMobile = window.innerWidth <= 768;
                
                const startY = isMobile ? 0 : -4;
                const travelDistance = isMobile ? 1.0 : 10;
                const targetY = startY + (portfolioProgress * travelDistance);

                threeStuff.targetPosition.set(0, targetY, 0);
                threeStuff.targetRotation.set(0, -portfolioSection * Math.PI * 1.5, 0);
                
                threeStuff.targetScale = isMobile ? 0.65 : 0.9;
            }
        }
    }, [threeStuff, updateSpiralCarousel]);

    const animate = useCallback(() => {
        threeStuff.animationFrameId = requestAnimationFrame(animate);
        threeStuff.time += 0.01;

        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const scrollProgress = Math.min(threeStuff.scrollY / maxScroll, 1);
        const currentSection = scrollProgress * 8;
        const transitionEnd = 1.2;

        if (currentSection < transitionEnd && threeStuff.logoModel && threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
            if (threeStuff.logoModel.scale.x < 0.99) {
                threeStuff.logoModel.scale.lerp(new THREE.Vector3(1, 1, 1), 0.03);
            }
            const logoProgress = currentSection / transitionEnd;
            threeStuff.logoModel.rotation.y = logoProgress * Math.PI * 3;
            
            const isMobile = window.innerWidth <= 768;
            const baseCameraZ = isMobile ? 14 : 8;
            threeStuff.logoCamera.position.z = baseCameraZ - (logoProgress * 2);
            threeStuff.logoCamera.lookAt(0, 0, 0);
            
            if (threeStuff.logoRenderer.domElement.parentNode) {
                threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
            }
        }
        
        if (!threeStuff.scenesInitialized) {
            return;
        }

        if (currentSection >= 0.4 && threeStuff.dnaModel && threeStuff.portfolioRenderer && threeStuff.portfolioScene) {
            threeStuff.dnaModel.rotation.y += (threeStuff.targetRotation.y - threeStuff.dnaModel.rotation.y) * 0.1;
            threeStuff.dnaModel.rotation.x += (threeStuff.targetRotation.x - threeStuff.dnaModel.rotation.x) * 0.1;
            const newScale = threeStuff.dnaModel.scale.x + (threeStuff.targetScale - threeStuff.dnaModel.scale.x) * 0.08;
            threeStuff.dnaModel.scale.set(newScale, newScale, newScale);
            threeStuff.dnaModel.rotation.y += threeStuff.mouse.x * 0.002;
            threeStuff.dnaModel.rotation.x += threeStuff.mouse.y * 0.002;

            threeStuff.dnaModel.position.lerp(threeStuff.targetPosition, 0.1);

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
    }, [threeStuff]);

    const handleHashNavigation = useCallback((hash) => {
        console.log('🔗 Navigating to hash:', hash);
        setCurrentHash(hash);

        const sectionId = hash.substring(1);

        const sectionPositions = {
            'solar': 0.4,
            'water': 0.45,
            'ev': 0.5,
            'branding': 0.55,
            'it': 0.6,
            'film': 0.65,
            'about': 0.95,
            'contact': 0.95,
            'achievement': 0.95,
            'awards': 0.95
        };

        const scrollProgress = sectionPositions[sectionId] || 0;
        const scrollY = scrollProgress * (document.body.scrollHeight - window.innerHeight);

        window.scrollTo({
            top: scrollY,
            behavior: 'smooth'
        });

        if (['solar', 'water', 'ev', 'branding', 'it', 'film'].includes(sectionId)) {
            const cardIndex = carouselData.findIndex(card => card.hash === hash);
            if (cardIndex !== -1) {
                setTimeout(() => {
                    updateSpiralCarousel(cardIndex);
                }, 300);
            }
        }
    }, [updateSpiralCarousel]);

    // Session Restoration Logic
    useEffect(() => {
        console.log('=== SESSION RESTORATION CHECK ===');
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        const returnHash = sessionStorage.getItem('currentHash');
        const returnScrollPosition = sessionStorage.getItem('scrollPosition');

        console.log('From homepage:', fromHomepage);
        console.log('Return hash:', returnHash);
        console.log('Return scroll:', returnScrollPosition);
        console.log('Model cache loaded:', modelCache.isLoaded);

        if (fromHomepage === 'true' && returnHash && location.pathname === '/') {
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
    }, [handleHashNavigation, location.pathname]);

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
        if (fromHomepage !== 'true') {
            if (location.state?.scrollPosition) {
                window.scrollTo(0, location.state.scrollPosition);
            } else {
                window.scrollTo(0, 0);
            }
        }
        
        const initScenes = () => {
            console.log('=== INITIALIZING THREE.JS SCENES ===');
            
            const hasModelsInCache = modelCache.isLoaded && modelCache.logoModel && modelCache.treeModel;
            const fromHomepage = sessionStorage.getItem('fromHomepage');
            const isReturning = fromHomepage === 'true' && hasModelsInCache;
            
            console.log('📦 Model cache status:', { 
                hasModelsInCache, 
                fromHomepage, 
                isReturning,
                logoModelExists: !!modelCache.logoModel,
                treeModelExists: !!modelCache.treeModel
            });
            
            if (isReturning) {
                console.log('🚀 INSTANT LOAD - Using cached models!');
                if (loadingOverlay.current) {
                    loadingOverlay.current.style.display = 'none';
                    console.log('✅ Loading overlay hidden IMMEDIATELY');
                }
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
            textureLoader.load(`${process.env.PUBLIC_URL}/images/bg2.png`,
                (texture) => {
                    threeStuff.logoScene.background = texture;
                },
                undefined,
                (error) => { 
                    threeStuff.logoScene.background = new THREE.Color(0x2a3d2a); 
                }
            );
            threeStuff.logoCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            threeStuff.logoCamera.position.set(0, 0, isMobile ? 14 : 8);
            threeStuff.logoCamera.lookAt(0, 0, 0);
            
            threeStuff.logoRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
            threeStuff.logoRenderer.setSize(window.innerWidth, window.innerHeight);
            threeStuff.logoRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            threeStuff.logoRenderer.setClearColor(0x2a3d2a, 1);
            
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
            threeStuff.portfolioScene.fog = new THREE.Fog(0x000000, 15, 50);
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
            
            const pLights = { ambient: new THREE.AmbientLight(0x404040, 1), main: new THREE.DirectionalLight(0xffffff, 1.0) };
            pLights.main.position.set(8, 8, 8);
            threeStuff.portfolioScene.add(pLights.ambient, pLights.main);

            // ✨ Apply texture to tree model
            const applyVibrantShader = (model) => {
                console.log('🎨 Applying tree texture to model...');
                
                // Load the tree texture from imported image
                const textureLoader = new THREE.TextureLoader();
                const treeTexture = textureLoader.load(
                    treeTextureImage,
                    (texture) => {
                        console.log('✅ Tree texture loaded successfully');
                        // Enable texture wrapping and repeat for better coverage
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(1, 1);
                        
                        // Force update after texture loads
                        if (threeStuff.portfolioRenderer && threeStuff.portfolioScene && threeStuff.portfolioCamera) {
                            threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
                        }
                    },
                    undefined,
                    (error) => {
                        console.error('❌ Error loading tree texture:', error);
                    }
                );
                
                let meshCount = 0;
                model.traverse((child) => {
                    if (child.isMesh) {
                        meshCount++;
                        
                        // Dispose old material
                        if (child.material && child.material.dispose) {
                            child.material.dispose();
                        }
                        
                        // Create new material with texture
                        child.material = new THREE.MeshStandardMaterial({
                            map: treeTexture,
                            roughness: 0.8,
                            metalness: 0.1,
                            side: THREE.DoubleSide
                        });
                        
                        child.material.needsUpdate = true;
                        
                        console.log('✅ Texture applied to mesh:', child.name || `mesh_${meshCount}`);
                    }
                });
                
                console.log(`🎨 Texture application complete! Processed ${meshCount} meshes.`);
                
                // Force a render update
                if (threeStuff.portfolioRenderer && threeStuff.portfolioScene && threeStuff.portfolioCamera) {
                    threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
                }
            };

            const finishLoading = () => {
                console.log('=== FINISHING LOADING ===');
                
                const delay = isReturning ? 0 : 500;
                
                setTimeout(() => {
                    if (loadingOverlay.current && !isReturning) {
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
                    threeStuff.dnaModel = modelCache.treeModel.clone();
                    threeStuff.dnaModel.position.copy(threeStuff.targetPosition);
                    
                    if (threeStuff.portfolioScene) {
                        threeStuff.portfolioScene.add(threeStuff.dnaModel);
                        console.log('✅ Cached tree added to scene');
                    }
                    
                    // Apply shader to cached model AFTER adding to scene
                    setTimeout(() => {
                        applyVibrantShader(threeStuff.dnaModel);
                    }, 100);
                    
                    threeStuff.isLoaded = true;
                    sessionStorage.setItem('modelsLoaded', 'true');
                    
                    if (threeStuff.portfolioRenderer && threeStuff.portfolioScene) {
                        threeStuff.portfolioRenderer.render(threeStuff.portfolioScene, threeStuff.portfolioCamera);
                    }
                    
                    onScroll();
                    return;
                }
                
                console.log('=== LOADING TREE MODEL FROM FILE ===');
                
                const treeLoader = new GLTFLoader();
                treeLoader.load(
                    `${process.env.PUBLIC_URL}/models/treeModel.glb`,
                    (gltf) => {
                        console.log('✅ Tree model loaded from file');
                        
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
                        
                        threeStuff.dnaModel = treeModel.clone();
                        threeStuff.dnaModel.position.copy(threeStuff.targetPosition);
                        
                        if (threeStuff.portfolioScene) {
                            threeStuff.portfolioScene.add(threeStuff.dnaModel);
                            console.log('✅ Tree model added to scene');
                        }
                        
                        // Apply vibrant shader AFTER adding to scene
                        setTimeout(() => {
                            applyVibrantShader(threeStuff.dnaModel);
                        }, 100);
                        
                        finishLoading();
                    },
                    (xhr) => {
                        if (!isReturning && xhr.lengthComputable && xhr.total > 0) {
                            console.log(`Tree loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                        }
                    },
                    (error) => { 
                        console.error('❌ ERROR loading tree model:', error);
                        const geometry = new THREE.ConeGeometry(0.5, 2, 8);
                        const material = new THREE.MeshStandardMaterial({ color: 0x10b981 });
                        threeStuff.dnaModel = new THREE.Mesh(geometry, material);
                        
                        if (threeStuff.portfolioScene) {
                            threeStuff.portfolioScene.add(threeStuff.dnaModel);
                        }
                        
                        finishLoading();
                    }
                );
            };

            if (hasModelsInCache && modelCache.logoModel) {
                console.log('✅ Using CACHED logo model');
                threeStuff.logoModel = modelCache.logoModel.clone();
                threeStuff.logoModel.scale.set(0.01, 0.01, 0.01);
                threeStuff.logoScene.add(threeStuff.logoModel);
                threeStuff.scenesInitialized = true;
                
                if (threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
                    threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
                }
                
                loadTreeModel();
            } else {
                console.log('=== LOADING LOGO MODEL FROM FILE ===');
                const gltfLoader = new GLTFLoader();
                gltfLoader.load(`${process.env.PUBLIC_URL}/models/logo.glb`,
                    (gltf) => {
                        console.log('✅ Logo model loaded from file');
                        const model = gltf.scene;
                        const box = new THREE.Box3().setFromObject(model);
                        const size = box.getSize(new THREE.Vector3());
                        const scale = 7 / Math.max(size.x, size.y, size.z);
                        model.scale.set(scale, scale, scale);
                        model.position.sub(box.getCenter(new THREE.Vector3()).multiplyScalar(scale));
                        
                        modelCache.logoModel = new THREE.Group();
                        modelCache.logoModel.add(model);
                        console.log('💾 Logo model CACHED in memory');
                        
                        threeStuff.logoModel = modelCache.logoModel.clone();
                        threeStuff.logoModel.scale.set(0.01, 0.01, 0.01);
                        threeStuff.logoScene.add(threeStuff.logoModel);
                        
                        if (threeStuff.logoRenderer && threeStuff.logoScene && threeStuff.logoCamera) {
                            threeStuff.logoRenderer.render(threeStuff.logoScene, threeStuff.logoCamera);
                        }
                        
                        threeStuff.scenesInitialized = true;
                        loadTreeModel();
                    },
                    (xhr) => {
                        if (!isReturning) {
                            if (xhr.lengthComputable && xhr.total > 0) {
                                setLoadingProgress(Math.round((xhr.loaded / xhr.total) * 100));
                            }
                        }
                    },
                    (error) => {
                        console.error('❌ ERROR loading logo model:', error);
                        const geometry = new THREE.IcosahedronGeometry(2.5, 1);
                        const material = new THREE.MeshStandardMaterial({ color: 0x10b981 });
                        threeStuff.logoModel = new THREE.Mesh(geometry, material);
                        threeStuff.logoScene.add(threeStuff.logoModel);
                        
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
        window.scrollTo(0, 0);

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
    }, [threeStuff, animate, onScroll, location, handleHashNavigation]);

    const zoomToService = useCallback((panel, link, index) => {
        const cardData = carouselData[index];
        const hash = cardData?.hash || '#solar';
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

    return (
        <div className="App">
            <div className="loading-overlay" ref={loadingOverlay}>
                <div className="loading-line"></div>
                <div className="loading-brand">SBD Energy</div>
                <div className="loading-subtitle">Sustainable Innovation</div>
                <div className="loading-progress">{loadingProgress}%</div>
            </div>

            <div className="zoom-overlay" ref={zoomOverlay}></div>
            <div className="progress-bar"><div className="progress-fill" ref={progressFill}></div></div>
            
            <div id="logo-canvas-container" ref={logoCanvasContainer}></div>
            <div id="portfolio-canvas-container" ref={portfolioCanvasContainer}></div>

            <div ref={smokeyBgRef} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                transition: 'opacity 0.8s ease-in-out',
                zIndex: 1
            }}>
                <SmokeyCursor />
            </div>
            
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
                            src={`${process.env.PUBLIC_URL}/images/noise.png`}
                            alt="Noise overlay"
                            className="panel-noise-overlay"
                        />
                        <div className="medium-text">{data.title}</div>
                        <div className="subtitle">{data.subtitle}</div>
                        <div className='click'>{data.click}</div>
                    </div>
                ))}
            </div>

            <div className="navigation-buttons" ref={navigationButtons}>
                <button className="nav-button" onClick={() => alert('Press Section')}>Social Welfare</button>
                <button className="nav-button" onClick={() => window.location.href='/about'}>About</button>
                <button className="nav-button" onClick={() => window.location.href='/contact'}>Contact</button>
                <button className="nav-button" onClick={() => window.location.href='/awards'}>Achievements</button>
            </div>

            <div className="content">
                {[...Array(9)].map((_, i) => <section key={i} className="section" id={i === 8 ? 'footer' : undefined}></section>)}
            </div>
        </div>
    );
}

export default App;