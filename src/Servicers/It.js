import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './It.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './it.jpg';

// Services Data
const servicesData = [
    {
        title: "City Surveillance & CCTV Systems",
        description: "Comprehensive design, deployment and analytics with AI-based detection, facial recognition, and ANPR (Automatic Number Plate Recognition) for municipal safety. Our advanced surveillance solutions provide 24/7 monitoring with intelligent video analytics, motion detection, and automated threat assessment. The system includes forensic search capabilities with metadata tagging, allowing operators to quickly locate and review specific incidents. Integration with emergency services enables rapid response coordination. Cloud-based architecture ensures redundancy and remote accessibility while maintaining data sovereignty. Advanced features include crowd detection, abandoned object alerts, perimeter breach detection, and behavioral analytics for proactive security management.",
        icon: "📹",
        features: ["AI-powered detection", "Facial recognition", "ANPR integration", "Forensic search", "Cloud & on-premise", "Real-time alerts"],
        images: [
            "/images/it/sr1.jpg",
            "/images/it/sr2.jpg",
            "/images/it/sr3.jpg"
        ]
    },
    {
        title: "Command & Control Centers (ICCC)",
        description: "Integrated Command & Control Center setups with real-time dashboards, incident response workflows and secure data feeds. Our ICCC solutions serve as the central nervous system for smart city operations, bringing together multiple departments including traffic management, public safety, utilities, and emergency services under one unified platform. The system features multi-screen video walls for comprehensive situational awareness, customizable dashboards for different stakeholder roles, and automated incident escalation protocols. Real-time data integration from IoT sensors, CCTV networks, and city databases enables predictive analytics and proactive decision-making. The platform supports multi-agency coordination with secure communication channels and shared incident management workflows, ensuring seamless collaboration during emergencies.",
        icon: "🎛️",
        features: ["Real-time dashboards", "Multi-agency integration", "Incident management", "Video wall systems", "Secure communications", "Predictive analytics"],
        images: [
            "/images/it/cd1.png",
            "/images/it/cd2.png",
            
        ]
    },
    {
        title: "Integrated Traffic Management System (ITMS)",
        description: "Advanced traffic monitoring with RLVD (Red Light Violation Detection), ANPR integration and adaptive signal control for congestion management and law enforcement support. Our ITMS solution combines intelligent transportation systems with enforcement automation to optimize traffic flow and enhance road safety. The system features automated violation detection including red light running, wrong-way driving, overspeeding, and lane violations with photographic evidence capture. ANPR-based tracking enables vehicle movement monitoring across the city, supporting law enforcement and stolen vehicle recovery. Adaptive traffic signal control uses real-time congestion data to optimize signal timings, reducing wait times and emissions. Integration with parking management systems provides drivers with real-time parking availability. Advanced analytics generate insights on traffic patterns, accident hotspots, and infrastructure planning needs.",
        icon: "🚦",
        features: ["ANPR integration", "RLVD systems", "Adaptive signals", "Traffic analytics", "Violation detection", "Congestion management"],
        images: [
            "/images/it/tl1.png",
            "/images/it/tl2.jpg",
            "/images/it/tl3.jpg",
            "/images/it/tl4.png"
        ]
    },
    {
        title: "OFC Laying & Fiber Infrastructure",
        description: "Planning and implementation of fiber optic backbones for resilient city infrastructure. We provide comprehensive fiber network solutions from design to commissioning, including route surveys, underground laying, aerial deployment, and building entry installations. Our services cover duct preparation, cable pulling, splicing, testing, and documentation. The infrastructure supports high-speed, reliable connectivity for smart city applications with bandwidth capacity that scales with future requirements. We implement redundant ring topologies for network resilience and failover protection. Fiber networks connect CCTV cameras, traffic signals, municipal buildings, and IoT sensors, forming the critical backbone of smart city operations. Our solutions include dark fiber leasing options, active network equipment installation, and ongoing maintenance contracts. Advanced OTDR testing ensures signal quality and helps locate faults quickly.",
        icon: "🔌",
        features: ["Underground laying", "Aerial deployment", "Splice & testing", "Network redundancy", "Route planning", "Dark fiber options"],
        images: [
            "/images/it/of1.jpg",
            "/images/it/of2.jpg",
            "/images/it/ofc1.jpg"
        ]
    },
];

const benefitsData = [
    {
        icon: "⚡",
        title: "Real-Time Awareness",
        description: "Live monitoring and instant situational updates across all city operations"
    },
    {
        icon: "⏱️",
        title: "Rapid Response",
        description: "Reduced incident response times with automated alerts and workflows"
    },
    {
        icon: "📈",
        title: "Scalable Architecture",
        description: "Future-proof systems that grow with city expansion and new requirements"
    },
    {
        icon: "🔗",
        title: "System Integration",
        description: "Seamless integration with existing municipal infrastructure and legacy systems"
    },
    {
        icon: "🛡️",
        title: "Enterprise Security",
        description: "Military-grade encryption and multi-layer security protocols"
    },
    {
        icon: "💾",
        title: "Data Sovereignty",
        description: "On-premise and cloud-hybrid options with complete data control"
    }
];

const statsData = [
    { number: "50+", label: "Smart Cities Deployed" },
    { number: "10,000+", label: "Cameras Installed" },
    { number: "99.9%", label: "System Uptime" },
    { number: "24/7", label: "Monitoring & Support" }
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

function ITAutomation() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);
    
    const handleBack = () => {
        const fromHomepage = sessionStorage.getItem('fromHomepage');
        if (fromHomepage === 'true') {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

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
        <div className="ITAutomationPage">
            <ThreeBackground/>
            {/* Navigation */}
            <nav className={`it-nav ${scrolled ? 'scrolled' : ''}`}>
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
            <section className="hero-section" style={{ transform: `translateY(-${heroTransform}px)` ,backgroundImage: `url(${bgImage})` }}>
                <div className="grid-background"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Intelligent <span className="highlight">Command & Control</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Secure, Scalable City Technology — End-to-end smart city systems: ICCC, CCTV, ITMS, 
                        OFC networks and fiber infrastructure — designed for safety, efficiency and future growth.
                    </p>
                    <button className="cta-button reveal-hero" style={{ transitionDelay: '0.4s' }}>
                        Schedule a Tech Briefing
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
                            <h2 className="section-title">Integrated Smart City Solutions</h2>
                            <p className="overview-text">
                                SBD provides integrated IT and automation solutions for municipal and enterprise clients: 
                                city surveillance systems, command & control centers, traffic management, OFC laying and 
                                network deployment. Our systems combine hardware, analytics and operations for safer, 
                                smarter cities with real-time monitoring and predictive intelligence.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Services Section - Alternating Layout */}
                <section className="services-section">
                    <div className="container">
                        <h2 className="section-title reveal">Our Technology Solutions</h2>
                        {servicesData.map((service, index) => (
                            <div 
                                className={`service-row reveal ${index % 2 === 0 ? 'layout-left' : 'layout-right'}`}
                                key={index}
                                style={{ transitionDelay: `${index * 0.05}s` }}
                            >
                                <div className="service-glass-card">
                                    <div className="service-content">
                                        <div className="service-header">
                                            <div className="service-icon">{service.icon}</div>
                                            <h3 className="service-title">{service.title}</h3>
                                        </div>
                                        <p className="service-description">{service.description}</p>
                                        <div className="service-features">
                                            {service.features.map((feature, idx) => (
                                                <span key={idx} className="feature-tag">{feature}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="service-images">
                                        {service.images.map((img, imgIndex) => (
                                            <div key={imgIndex} className="service-img-wrapper">
                                                <img src={img} alt={`${service.title} ${imgIndex + 1}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="benefits-section">
                    <div className="container">
                        <h2 className="section-title reveal">Key Benefits & Capabilities</h2>
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

                {/* Technology Stack */}
                <section className="tech-stack-section">
                    <div className="container">
                        <h2 className="section-title reveal">Technology Stack</h2>
                        <div className="tech-panels">
                            <div className="tech-panel reveal" style={{ transitionDelay: '0.1s' }}>
                                <h3 className="tech-panel-title">Hardware</h3>
                                <ul className="tech-list">
                                    <li>Enterprise-grade cameras & sensors</li>
                                    <li>Video wall displays</li>
                                    <li>Network switches & routers</li>
                                    <li>Storage arrays (NVR/SAN)</li>
                                </ul>
                            </div>
                            <div className="tech-panel reveal" style={{ transitionDelay: '0.2s' }}>
                                <h3 className="tech-panel-title">Software</h3>
                                <ul className="tech-list">
                                    <li>Video Management System (VMS)</li>
                                    <li>AI analytics engine</li>
                                    <li>GIS integration</li>
                                    <li>Mobile command apps</li>
                                </ul>
                            </div>
                            <div className="tech-panel reveal" style={{ transitionDelay: '0.3s' }}>
                                <h3 className="tech-panel-title">Operations</h3>
                                <ul className="tech-list">
                                    <li>24/7 SOC monitoring</li>
                                    <li>Preventive maintenance</li>
                                    <li>Incident response teams</li>
                                    <li>Training & support</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <div className="container">
                        <div className="cta-content reveal">
                            <h2 className="cta-title">Ready to Transform Your City?</h2>
                            <p className="cta-text">
                                Let's discuss how our smart city solutions can enhance safety, efficiency and citizen services. 
                                Schedule a technical briefing with our experts.
                            </p>
                            <div className="cta-buttons">
                                <button className="cta-primary">Schedule Tech Briefing</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Back Button */}
            <div 
            className="back-button" 
            onClick={handleBack}
            title="Back to Home"
        ></div>
        </div>
    );
}

export default ITAutomation;