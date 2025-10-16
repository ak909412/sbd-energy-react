import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ev.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './ev.jpg';

// Installation Locations Data
const installationLocations = [
    {
        name: "Atal Indore City Transport Service Ltd.",
        image: "/images/ev/5.jpg"
    },
    {
        name: "Safdarjung Airport, Delhi",
        image: "/images/ev/6.png"
    },
    {
        name: "Municipal Corporation, Indore",
        image: "/images/ev/7.png"
    },
    {
        name: "Smart City Office, Indore",
        image: "/images/ev/2.jpg"
    },
    {
        name: "GMDA Office, Gurgaon",
        image: "/images/ev/3.jpg"
    },
    {
        name: "IGI Airport, New Delhi",
        image: "/images/ev/4.jpg"
    }
];

// Services Data with expanded content

const statsData = [
    { number: "5000+", label: "Chargers Deployed", icon: "" },
    { number: "200+", label: "Sites Nationwide", icon: "" },
    { number: "99.2%", label: "Average Uptime", icon: "" },
    { number: "500K+", label: "Charging Sessions", icon: "" }
];


const benefitsData = [
    {
        icon: "",
        title: "Nationwide Coverage",
        description: "Installations across airports, municipalities, and commercial spaces"
    },
    {
        icon: "",
        title: "Government Experience",
        description: "EESL partnerships and large-scale government procurement"
    },
    {
        icon: "",
        title: "Interoperability",
        description: "OCPP standard support for seamless network integration"
    },
    {
        icon: "",
        title: "Smart Management",
        description: "Cloud-based monitoring and mobile app integration"
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

function EVCharging() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);

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
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        if (fromHomepage === 'true') {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="EVChargingPage">
            <ThreeBackground/>
            {/* Navigation */}
            <nav className={`ev-nav ${scrolled ? 'scrolled' : ''}`}>
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
                <div className="charging-animation"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Building India's <span className="highlight">EV Charging Backbone</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Site feasibility, charger deployment, power upgrades and operation for public & private 
                        networks — reliable charging where and when it's needed.
                    </p>
                    <button className="cta-button reveal-hero" style={{ transitionDelay: '0.4s' }}>
                        Book a Site Survey
                    </button>
                </div>
            </section>

            <main className="main-content">
                {/* Stats Section */}
                <section className="stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            {statsData.map((stat, index) => (
                                <div className="stat-card reveal" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="stat-icon">{stat.icon}</div>
                                    <div className="stat-number">{stat.number}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Overview Section */}
                <section className="overview-section">
                    <div className="container">
                        <div className="overview-content reveal">
                            <h2 className="section-title">Comprehensive EV Infrastructure Solutions</h2>
                            <p className="overview-text">
                                SBD is a trusted provider of EV charging solutions across India. We deliver comprehensive 
                                EV infrastructure projects covering civil works, electrical installations, charger hardware 
                                integration, and networking solutions. Our end-to-end approach ensures reliable, interoperable 
                                charging infrastructure for fleets, airports, municipalities and commercial spaces. With proven 
                                experience in government partnerships and mass deployments, we're building the charging backbone 
                                that will power India's electric mobility revolution.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Installations Section */}
                <section className="installations-section">
                    <div className="container">
                        <h2 className="section-title reveal">Installations at Various Places</h2>
                        <div className="installations-grid">
                            {installationLocations.map((location, index) => (
                                <div 
                                    className="installation-card reveal" 
                                    key={index}
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div className="installation-image">
                                        <img 
                                            src={location.image} 
                                            alt={location.name}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/600x400/0A0E1A/00D1FF?text=' + encodeURIComponent(location.name);
                                            }}
                                        />
                                        <div className="installation-overlay">
                                            <div className="installation-name">{location.name}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits-section">
                    <div className="container">
                        <h2 className="section-title reveal">Why Choose SBD for EV Infrastructure</h2>
                        <div className="benefits-grid">
                            {benefitsData.map((benefit, index) => (
                                <div 
                                    className="benefit-card reveal" 
                                    key={index}
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div className="benefit-icon">{benefit.icon}</div>
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Deployment Footprint */}
                <section className="footprint-section">
                    <div className="container">
                        <div className="footprint-content reveal">
                            <h2 className="section-title">Our Deployment Footprint</h2>
                            <p className="footprint-text">
                                Successful deployments at airports, smart city offices, and municipal locations nationwide. 
                                Our portfolio includes prestigious projects with government agencies, private corporations, 
                                and urban development authorities. We have extensive experience handling government procurement 
                                processes and managing mass installations, including landmark projects such as the 720 AC 
                                chargers deployment across multiple cities. Our installations span residential complexes, 
                                corporate campuses, highway corridors, public parking facilities, and dedicated fleet charging hubs.
                            </p>
                            <div className="footprint-highlights">
                                <div className="highlight-item">
                                    <div className="highlight-number">15+</div>
                                    <div className="highlight-label">States Covered</div>
                                </div>
                                <div className="highlight-item">
                                    <div className="highlight-number">50+</div>
                                    <div className="highlight-label">Cities</div>
                                </div>
                                <div className="highlight-item">
                                    <div className="highlight-number">10+</div>
                                    <div className="highlight-label">Airports</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content reveal">
                            <h2 className="cta-title">Ready to Deploy EV Charging?</h2>
                            <p className="cta-text">
                                Let's assess your site and design the optimal charging solution. 
                                Our team will conduct a comprehensive feasibility study and provide detailed recommendations.
                            </p>
                            <div className="cta-buttons">
                                <button className="cta-primary">Book Site Survey</button>
                                <button className="cta-secondary">Download Deployment Guide</button>
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

export default EVCharging;