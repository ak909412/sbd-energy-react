import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Water.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './water.jpg';
import logo from './logo.png';

// Services Data
const servicesData = [
    {
        title: "Har Ghar Jal – Jal Jeevan Mission Implementation",
        description: "Even after more than five decades of independence, many rural communities continued to struggle for access to clean and safe drinking water, a basic human necessity. Most villages relied on traditional and often unsafe sources such as rivers, lakes, and tube wells. A comprehensive initiative was undertaken to ensure end-to-end water supply solutions—from source development to household tap connections, coupled with regular water quality monitoring and active community participation. We have installed the plants even in remote, disturbed, and previously inaccessible regions, ensuring that every household receives reliable access to clean drinking water, improving the health, dignity, and quality of life of the villagers.",
        lottieUrl: "https://lottie.host/22c0c419-7b51-46cb-aa6a-287f378ce0f9/n8HvwjAbIK.lottie",
        images: [
            "/images/water/hgj1.jpg",
            "/images/water/hgj2.jpg",
            "/images/water/hgj3.jpg"
        ]
    },
    {
        title: "Rural Piped Water Supply (JJM) – Bihar & Assam",
        description: "Design and execution of source development, treatment plants, storage and distribution networks across multiple wards and districts in Bihar and Assam.",
        lottieUrl: "https://lottie.host/98a01fb7-2978-4c05-b105-257bd2643869/c7XPRC5OdT.lottie",
        images: [
            "/images/water/wsp1.jpg",
            "/images/water/wsp2.jpg",
            "/images/water/wsp3.jpg"
        ]
    }
];

const whyChooseData = [
    {
        icon: "",
        title: "Community Focused",
        description: "Local stakeholder participation and capacity building"
    },
    {
        icon: "",
        title: "Sustainable Solutions",
        description: "Energy-efficient, solar-powered systems where appropriate"
    },
    {
        icon: "",
        title: "Quality Assurance",
        description: "Periodic water quality monitoring and compliance"
    },
    {
        icon: "",
        title: "Smart Technology",
        description: "SCADA systems for efficient monitoring and control"
    }
];

const projectPhases = [
    {
        title: "Assessment",
        description: "Source evaluation and feasibility study",
        icon: ""
    },
    {
        title: "Design",
        description: "Treatment plant and network engineering",
        icon: ""
    },
    {
        title: "Implementation",
        description: "Construction and system installation",
        icon: ""
    },
    {
        title: "Monitoring",
        description: "Quality control and ongoing maintenance",
        icon: ""
    }
];

// Scroll Reveal Hook
const useScrollReveal = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
};

function Water() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);

    // Load Lottie Player script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
        script.type = 'module';
        document.head.appendChild(script);

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    // ✅ Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            setHeroTransform(scrollY * 1.5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ Navigation functions with black screen transition
    const navigateHome = () => {
        const returnScrollPosition = sessionStorage.getItem('returnScrollPosition');
        const returnHash = sessionStorage.getItem('currentHash');
        
        console.log('🏠 Navigating home with transition overlay');
        
        // ✨ Create and show black screen transition overlay
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        transitionOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: #000;
            z-index: 99999;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: all;
        `;
        document.body.appendChild(transitionOverlay);
        
        // Fade in black screen immediately
        requestAnimationFrame(() => {
            transitionOverlay.style.opacity = '1';
        });
        
        // ✨ Set instant return flag to skip loading screen
        sessionStorage.setItem('instantReturn', 'true');
        
        // Navigate after black screen is fully visible (300ms)
        setTimeout(() => {
            navigate('/', {
                state: {
                    scrollPosition: returnScrollPosition,
                    hash: returnHash,
                    instantReturn: true
                }
            });
        }, 300);
    };

    const navigateToAbout = () => {
        navigate('/about');
    };

    const navigateToContact = () => {
        navigate('/contact');
    };

    const navigateToAwards = () => {
        navigate('/awards');
    };

    return (
        <div className="WaterPage">
            <ThreeBackground />
            
            {/* Navigation */}
            <nav className={`water-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* <div className="logo" onClick={navigateHome}>
                        <img src={logo} alt="SBD Energy" />
                    </div> */}
                    {/* <div className="nav-links">
                        <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); navigateHome(); }}>Home</a>
                        <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>About</a>
                        <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToContact(); }}>Contact</a>
                        <a href="/awards" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAwards(); }}>Achievements</a>
                    </div> */}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" style={{ transform: `translateY(-${heroTransform}px)`}}>
                {/* , backgroundImage: `url(${bgImage})` */}
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Delivering Safe, Reliable <span className="highlight">Water</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Scalable Water Distribution & Purification — Implementing Jal Jeevan Mission 
                        (Har Ghar Jal) projects and rural piped water schemes in Bihar, Assam and beyond.
                    </p>
                    <button 
                        className="cta-button reveal-hero" 
                        style={{ transitionDelay: '0.4s' }}
                        onClick={navigateToContact}
                    >
                        Request Project Consultation
                    </button>
                </div>
            </section>

            <main className="main-content">
                {/* Overview Section */}
                <section className="overview-section">
                    <div className="container">
                        <div className="overview-content reveal">
                            <h2 className="section-title">Comprehensive Water Solutions</h2>
                            <p className="overview-text">
                                SBD implements large-scale rural and semi-urban water distribution systems—including piped 
                                water supply schemes, treatment, distribution network design and operation—tailored to local 
                                needs and sustainability goals. Our focus is safe drinking water, efficient distribution, and 
                                long-term operability with community participation.
                            </p>
                        </div>
                        <div className="overview-stats reveal" style={{ transitionDelay: '0.2s' }}>
                            <div className="stat-item">
                                <div className="stat-number">50K+</div>
                                <div className="stat-label">Households Connected</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">10+</div>
                                <div className="stat-label">Districts Covered</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">Monitoring Systems</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section - Full Page for Each Service */}
                <section className="services-section">
                    <div className="container">
                        <h2 className="section-title reveal">Our Water Management Services</h2>
                        {servicesData.map((service, index) => (
                            <div 
                                className="service-full-page reveal" 
                                key={index}
                                style={{ transitionDelay: `${index * 0.05}s` }}
                            >
                                <div className="service-glass-panel">
                                    <div className="service-header">
                                        <div className="service-icon-container">
                                            <dotlottie-player
                                                src={service.lottieUrl}
                                                background="transparent"
                                                speed="1"
                                                style={{ width: '100px', height: '100px' }}
                                                loop
                                                autoplay
                                            ></dotlottie-player>
                                        </div>
                                        <h3 className="service-title">{service.title}</h3>
                                    </div>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-images-grid">
                                        {service.images.map((img, imgIndex) => (
                                            <div key={imgIndex} className="service-image-card">
                                                <img src={img} alt={`${service.title} ${imgIndex + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why Choose SBD */}
                <section className="why-choose-section">
                    <div className="container">
                        <h2 className="section-title reveal">Community & Sustainability</h2>
                        <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                            We design systems that are resilient, energy-efficient, and governed with local stakeholder 
                            participation. Our approach ensures equitable access without compromise to dignity or quality.
                        </p>
                        <div className="why-choose-grid">
                            {whyChooseData.map((item, index) => (
                                <div 
                                    className="why-card reveal" 
                                    key={index}
                                    style={{ transitionDelay: `${index * 0.15}s` }}
                                >
                                    <div className="why-icon">{item.icon}</div>
                                    <h3 className="why-title">{item.title}</h3>
                                    <p className="why-description">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Project Process */}
                <section className="process-section">
                    <div className="container">
                        <h2 className="section-title reveal">Implementation Process</h2>
                        <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                            From source to household — A comprehensive approach to water distribution
                        </p>
                        <div className="process-container">
                            {projectPhases.map((phase, index) => (
                                <React.Fragment key={index}>
                                    <div className="process-step reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
                                        <div className="step-icon">{phase.icon}</div>
                                        <div className="step-number">0{index + 1}</div>
                                        <h3 className="step-title">{phase.title}</h3>
                                        <p className="step-description">{phase.description}</p>
                                    </div>
                                    {index < projectPhases.length - 1 && (
                                        <div className="step-arrow">→</div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content reveal">
                            <h2 className="cta-title">Ready to Implement Water Solutions?</h2>
                            <p className="cta-text">
                                Let's discuss how we can bring safe, reliable water to your community. 
                                Get expert consultation on Jal Jeevan Mission implementation and water distribution systems.
                            </p>
                            <div className="cta-buttons">
                                <button className="cta-primary" onClick={navigateToContact}>Schedule Consultation</button>
                           </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Back Button */}
            <div className="back-button" onClick={navigateHome} title="Back"></div>
        </div>
    );
}

export default Water;