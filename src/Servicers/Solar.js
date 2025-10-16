import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Solar.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './solar.webp';
 
// Services Data
const servicesData = [
    {
        title: "Solar Photovoltaic Systems",
        description: "Grid-tied and off-grid PV installations for residential, commercial and industrial clients. Complete site surveys, design, procurement, installation, commissioning and O&M.",
        lottieUrl: "https://lottie.host/b69ebe3c-6ebc-45a4-b41f-9dde922e9d6c/nPOB4Xl1wB.lottie",
        images: [
            "/images/solar/sp1.jpg",
            "/images/solar/sp2.jpg"
        ]
    },
    {
        title: "Solar Water Heating Systems",
        description: "Efficient, low-maintenance systems for hotels, hospitals and institutions; integrated with existing hot water infrastructure.",
        lottieUrl: "https://lottie.host/22c0c419-7b51-46cb-aa6a-287f378ce0f9/n8HvwjAbIK.lottie", // Replace with your water heating Lottie URL
        images: [
            "/images/solar/swh.jpg"
        ]
    },
    {
        title: "Electrification of Villages",
        description: "Mini-grids and microgrids that bring dependable electricity for lighting, livelihoods and community services. Designed for scalability and community management.",
        lottieUrl: "https://lottie.host/51dbfd7f-3704-4920-8b09-02d0ee15060b/Wfor3de7H9.lottie", // Replace with your village electrification Lottie URL
        images: [
            "/images/solar/esv2.jpg",
            "/images/solar/evs1.jpg",
            "/images/solar/evs3.jpg"
        ]
    },
    {
        title: "Remote Area Solutions",
        description: "Ruggedized PV systems and energy storage optimized for extreme climates and inaccessible sites.",
        lottieUrl: "https://lottie.host/908bbd46-5ed4-4133-9b90-64d388994ec5/uazSraOL9A.lottie", // Replace with your remote area Lottie URL
        images: [
            "/images/solar/ril1.jpg",
            "/images/solar/ril2.jpg"
        ]
    },
    {
        title: "Solar Research & Development",
        description: "Collaborative R&D programs with universities to test new modules, tracking systems and hybrid architectures.",
        lottieUrl: "https://lottie.host/6d5b8111-bef3-411c-8883-9b99ec5d2c79/kvPehw1Qct.lottie", // Replace with your R&D Lottie URL
        images: [
            "/images/solar/sp1.jpg",
            "/images/solar/sp2.jpg"
        ]
    },
    {
        title: "Solar Hybrid Power Plants",
        description: "Integrated PV + storage + conventional backup for continuous supply and grid stability.",
        lottieUrl: "https://lottie.host/34fbe719-fbcc-4cea-9849-eff5ec2a432a/gj0SvpqpGS.lottie", // Replace with your hybrid plants Lottie URL
        images: [
            "/images/solar/sh1.jpg",
            "/images/solar/sh2.jpg"
        ]
    },
    {
        title: "Solar Water Pumping",
        description: "Solar pumps (AC/DC) for irrigation and domestic water supply with smart controllers and telemetry.",
        lottieUrl: "https://lottie.host/c69f739f-0033-415d-85bd-0d36c5e5ae0f/qPL89fDrsJ.lottie", // Replace with your water pumping Lottie URL
        images: [
            "/images/solar/swp.jpg",
            "/images/solar/swp2.jpg"
        ]
    },
    {
        title: "Solar Street Lighting",
        description: "Smart LED street lights with solar panels, motion sensors and remote monitoring.",
        lottieUrl: "https://lottie.host/b4ad082f-d6b2-423d-a40a-1b0d1dd46fec/Z2zIpM2pIO.lottie", // Replace with your street lighting Lottie URL
        images: [
            "/images/solar/ssl.jpg",
            "/images/solar/ssl2.jpg",
            "/images/solar/ssl3.jpg",
        ]
    }
];

const whyChooseData = [
    {
        icon: "✅",
        title: "Proven Track Record",
        description: "Projects across states and with government agencies"
    },
    {
        icon: "🔄",
        title: "End-to-End Delivery",
        description: "Feasibility → Design → Installation → O&M"
    },
    {
        icon: "🤝",
        title: "Research Partnerships",
        description: "Collaboration with DTU and Jamia for innovation"
    },
    {
        icon: "🌍",
        title: "Inclusive Solutions",
        description: "Built for communities, industries and institutions"
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

function Solar() {
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

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            setHeroTransform(scrollY * 1.5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigateHome = () => {
        // Check if we came from homepage with a hash
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        if (fromHomepage === 'true') {
            // Navigate back to trigger the restoration logic
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="SolarPage">
            <ThreeBackground/>
            {/* Navigation */}
            <nav className={`solar-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="logo" onClick={navigateHome}>SBD Energy</div>
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/services" className="nav-link">Services</a>
                        <a href="/about" className="nav-link">About</a>
                        <a href="/contact" className="nav-link">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" style={{ transform: `translateY(-${heroTransform}px)`, backgroundImage: `url(${bgImage})` }}>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Clean, Reliable <span className="highlight">Solar Solutions</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        End-to-end solar services: PV systems, hybrid plants, mini-grids, pumps and street lighting — 
                        engineered for reliability and lasting impact across India.
                    </p>
                    <button className="cta-button reveal-hero" style={{ transitionDelay: '0.4s' }}>
                        Get a Free Feasibility Assessment
                    </button>
                </div>
            </section>

            <main className="main-content">

            {/* Overview Section */}
            <section className="overview-section">
                <div className="container">
                    <div className="overview-content reveal">
                        <h2 className="section-title">Powering India's Sustainable Future</h2>
                        <p className="overview-text">
                            SBD designs, installs and operates solar power systems that reduce energy costs, lower emissions, 
                            and enable electricity access in urban and remote locations. Our projects range from rooftop and 
                            industrial PV to solar mini-grids and hybrid plants. We partner with government agencies, universities, 
                            and private clients to deliver resilient, high-performance systems.
                        </p>
                    </div>
                    <div className="overview-stats reveal" style={{ transitionDelay: '0.2s' }}>
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Project Locations</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50 MW+</div>
                            <div className="stat-label">Installed Capacity</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">22+</div>
                            <div className="stat-label">Years Experience</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section - Full Page for Each Service */}
            <section className="services-section">
                <div className="container">
                    <h2 className="section-title reveal">Our Solar Solutions</h2>
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
                    <h2 className="section-title reveal">Why Choose SBD for Solar?</h2>
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

            {/* How It Works */}
            <section className="how-it-works-section">
                <div className="container">
                    <h2 className="section-title reveal">How It Works</h2>
                    <div className="steps-container">
                        <div className="step reveal" style={{ transitionDelay: '0.1s' }}>
                            <div className="step-number">01</div>
                            <h3 className="step-title">Survey & Assessment</h3>
                            <p className="step-description">Comprehensive site evaluation and feasibility study</p>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step reveal" style={{ transitionDelay: '0.2s' }}>
                            <div className="step-number">02</div>
                            <h3 className="step-title">Design & Install</h3>
                            <p className="step-description">Custom engineering and professional installation</p>
                        </div>
                        <div className="step-arrow">→</div>
                        <div className="step reveal" style={{ transitionDelay: '0.3s' }}>
                            <div className="step-number">03</div>
                            <h3 className="step-title">Monitor & Manage</h3>
                            <p className="step-description">Ongoing O&M with remote monitoring and support</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content reveal">
                        <h2 className="cta-title">Ready to Go Solar?</h2>
                        <p className="cta-text">
                            Let's discuss how solar can reduce your energy costs and carbon footprint. 
                            Get a free consultation and feasibility assessment.
                        </p>
                        <div className="cta-buttons">
                            <button className="cta-primary">Schedule Consultation</button>
                            <button className="cta-secondary">Download Brochure</button>
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

export default Solar;