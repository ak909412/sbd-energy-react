import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './branding.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './branding.png';
import logo from './logo.png';

// Services Data
const servicesData = [
    {
        title: "Outdoor Advertising Inventory",
        description: "Premium outdoor advertising placements across Delhi NCR's highest-traffic corridors. Our extensive inventory includes strategically positioned unipoles, large-format hoardings, and landmark sites in Gurgaon, Delhi, and connecting expressways. We own and manage premium locations near corporate hubs, shopping districts, metro stations, and major intersections ensuring maximum visibility and impressions. Each site is carefully selected based on traffic density, demographic profiling, and brand alignment. Our inventory includes lit and non-lit options, with sizes ranging from 10x20 ft to 40x40 ft. We handle all aspects including structural maintenance, lighting, permissions, and municipal compliance. With real-time availability tracking and flexible booking terms, we make outdoor advertising accessible and hassle-free. Premium locationsCorporate hubsMetro proximityLit optionsFlexible terms",
        icon: "📍",
        features: ["Premium locations", "Corporate hubs", "Metro proximity", "Lit options", "Flexible terms"],
        stats: { inventory: "150+ sites", coverage: "Delhi NCR", visibility: "5M+ daily" }
    },
    {
        title: "Creative Production & Design",
        description: "End-to-end creative services that transform brand messages into compelling outdoor experiences. Our in-house design team specializes in large-format visual communication, understanding the unique challenges of outdoor media—visibility at speed, message hierarchy, and environmental context. We create concepts that capture attention in 3-5 seconds while maintaining brand integrity. We ensure color accuracy, structural durability, and regulatory compliance. From initial concept sketches to final installation, we manage print quality, mounting specifications, and site-specific adaptations. Our portfolio spans product launches, brand campaigns, event promotions, and corporate branding initiatives. Concept developmentLarge-format printing3D elementsWeather-proofBrand guidelines",
        icon: "🎨",
        features: ["Concept development", "Large-format printing", "3D elements", "Weather-proof", "Brand guidelines"],
        stats: { projects: "500+", turnaround: "7-10 days", satisfaction: "98%" }
    },
    {
        title: "Campaign Strategy & Management",
        description: "Data-driven campaign planning that maximizes reach, frequency, and return on ad spend. We begin with thorough market analysis—understanding your target audience, competitive landscape, and campaign objectives. Our strategic approach includes site selection based on demographic heat maps, traffic patterns, and commuter behavior. We optimize campaign calendars considering seasonality, events, and market dynamics. Our management services cover permit acquisition, installation coordination, maintenance scheduling, and performance monitoring. We provide detailed campaign reports with impression estimates, photographic proof of presence, and maintenance logs. For multi-site campaigns, we ensure consistent brand presentation while adapting to location-specific requirements. Post-campaign analysis helps refine future strategies. Market analysisSite selectionPermit handlingPerformance trackingROI optimization",
        icon: "📊",
        features: ["Market analysis", "Site selection", "Permit handling", "Performance tracking", "ROI optimization"],
        stats: { campaigns: "200+", clients: "80+", retention: "85%" }
    }
];

// Portfolio Items
const portfolioItems = [
    {
        client: "M3M",
        location: "Delhi - GTB Nagar",
        image: "/images/branding/1.png",
        description: " "
    },
    {
        client: "ALBAN",
        location: "Delhi - Vishwavidyalaya Metro Station",
        image: "/images/branding/2.png",
        description: " "
    },
    {
        client: "TATA 1mg",
        location: "Delhi - Vishwavidyalaya Mall Road RHS",
        image: "/images/branding/3.png",
        description: " "
    },
    {
        client: "Indiabulls",
        location: "Gurugram - Hamilton Court",
        image: "/images/branding/4.jpg",
        description: " "
    },
    {
        client: "4S",
        location: "Gurugram - New Palam Vihar Sec. 109 Dwarka Expressway",
        image: "/images/branding/5.png",
        description: " "
    },
    {
        client: "OTR Cafe",
        location: "Gurugram - SPR Road",
        image: "/images/branding/6.jpg",
        description: " "
    },
    {
        client: "Nissan",
        location: "Bhikaji Cama Place",
        image: "/images/branding/7.png",
        description: " "
    },
    {
        client: "Nivea",
        location: "Delhi - Panchsheel",
        image: "/images/branding/8.png",
        description: " "
    },
    {
        client: "AASAN",
        location: "Wazirpur Flyover",
        image: "/images/branding/9.jpg",
        description: " "
    },
    {
        client: "EXPERION",
        location: "Opp. Pacific Mall, Netaji Subash Palace",
        image: "/images/branding/10.png",
        description: " "
    }
];

// Case Study Data
const caseStudy = {
    client: "Premium Residential Project",
    challenge: "Launch a luxury residential development in a competitive Gurgaon market with limited brand recognition",
    approach: [
        "Conducted demographic analysis of target affluent audience",
        "Selected 12 premium sites near corporate parks and golf course road",
        "Created sophisticated visual language emphasizing lifestyle and location",
        "Integrated QR codes linking to virtual property tours",
        "Coordinated launch timing with digital and print campaigns"
    ],
    execution: [
        "Custom-designed 40x20 ft backlit hoardings with 3D developer logo",
        "High-resolution architectural renders with sunset lighting",
        "Strategic placement ensuring 360° coverage around project location",
        "Installation completed in 72 hours for synchronized launch",
        "Real-time monitoring and maintenance throughout 3-month campaign"
    ],
    impact: {
        impressions: "8.2M+",
        siteVisits: "420% increase",
        inquiries: "680+ qualified leads",
        conversion: "Pre-launch booking target exceeded by 45%"
    }
};

// Testimonials
const testimonials = [
    {
        name: "Rajesh Malhotra",
        position: "Marketing Head, Retail Chain",
        quote: "SBD transformed our seasonal campaign into a city-wide phenomenon. Their site selection and creative execution drove a 35% increase in footfall across our stores.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        position: "Brand Manager, Tech Startup",
        quote: "From concept to installation, the entire process was seamless. The creative team understood our brand DNA and translated it perfectly for outdoor media.",
        rating: 5
    },
    {
        name: "Amit Verma",
        position: "VP Marketing, Real Estate",
        quote: "Their strategic approach to site selection and data-driven campaign management delivered ROI that exceeded our projections. Highly recommended.",
        rating: 5
    }
];

// Media Specifications
const mediaSpecs = [
    { size: "20x10 ft", type: "Standard Hoarding", price: "", visibility: "High" },
    { size: "30x15 ft", type: "Premium Hoarding", price: "", visibility: "Very High" },
    { size: "40x20 ft", type: "Unipole", price: "", visibility: "Maximum" },
    { size: "Custom", type: "Landmark Sites", price: "", visibility: "Iconic" }
];

const statsData = [
    { number: "150+", label: "Active Inventory", icon: "" },
    { number: "500+", label: "Campaigns Delivered", icon: "" },
    { number: "5M+", label: "Daily Impressions", icon: "" },
    { number: "85%", label: "Client Retention", icon: "" }
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

function BrandingAdvertising() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [activePortfolio, setActivePortfolio] = useState(0);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        budget: '',
        details: ''
    });
    const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });

    // ✅ Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePortfolio((prev) => (prev + 1) % portfolioItems.length);
        }, 5000);
        return () => clearInterval(interval);
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


    const nextPortfolio = () => {
        setActivePortfolio((prev) => (prev + 1) % portfolioItems.length);
    };

    const prevPortfolio = () => {
        setActivePortfolio((prev) => (prev - 1 + portfolioItems.length) % portfolioItems.length);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormStatus({ loading: true, success: false, error: false });

        try {
            // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setFormStatus({ loading: false, success: true, error: false });
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    budget: '',
                    details: ''
                });
                // Hide success message after 5 seconds
                setTimeout(() => {
                    setFormStatus({ loading: false, success: false, error: false });
                }, 5000);
            } else {
                setFormStatus({ loading: false, success: false, error: true });
            }
        } catch (error) {
            setFormStatus({ loading: false, success: false, error: true });
        }
    };

    return (
        <div className="BrandingAdvertisingPage">
            <ThreeBackground/>
            {/* Navigation */}
            <nav className={`branding-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* <div className="logo" onClick={navigateHome}>
                        <img src={logo} alt="SBD Energy" />
                    </div> */}
                    {/* <div className="logo" onClick={navigateHome}>SBD Energy</div> */}
                    {/* <div className="nav-links">
                        <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); navigateHome(); }}>Home</a>
                        <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>About</a>
                        <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToContact(); }}>Contact</a>
                        <a href="/awards" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAwards(); }}>Achievements</a>
                    </div> */}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                {/* style={{ backgroundImage: `url(${bgImage})`}} */}
                <div className="hero-background"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Strategic Outdoor Advertising &<br />
                        <span className="highlight">Brand Communication</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        High-impact outdoor placements and content-first campaigns across Delhi NCR 
                        that amplify brand visibility and ROI.
                    </p>
                    <button 
                        className="cta-button reveal-hero" 
                        style={{ transitionDelay: '0.4s' }}
                        onClick={navigateToContact}
                    >
                        Request Media Kit
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
                            <h2 className="section-title">Creative Strategy Meets Executional Excellence</h2>
                            <p className="overview-text">
                                SBD's branding arm blends creative strategy with executional excellence. We offer outdoor advertising inventory, creative production, and campaign management. Our placements include unipoles, hoardings and premium sites in Gurgaon and Delhi. From concept to installation, we handle every aspect of outdoor brand communication, ensuring your message reaches the right audience at the right location with maximum impact.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Portfolio Carousel */}
                <section className="portfolio-section">
                    <div className="container">
                        <h2 className="section-title reveal">Featured Work</h2>
                        <div className="portfolio-carousel reveal">
                            <div className="carousel-main">
                                <div className="carousel-image">
                                    <img src={portfolioItems[activePortfolio].image} alt={portfolioItems[activePortfolio].client} />
                                    <div className="image-overlay">
                                        <h3 className="portfolio-client">{portfolioItems[activePortfolio].client}</h3>
                                        <p className="portfolio-location">{portfolioItems[activePortfolio].location}</p>
                                    </div>
                                </div>
                                <div className="carousel-controls">
                                    <button className="carousel-btn prev" onClick={prevPortfolio}>{'‹'}</button>
                                    <div className="carousel-indicators">
                                        {portfolioItems.map((_, index) => (
                                            <span 
                                                key={index} 
                                                className={`indicator ${index === activePortfolio ? 'active' : ''}`}
                                                onClick={() => setActivePortfolio(index)}
                                            ></span>
                                        ))}
                                    </div>
                                    <button className="carousel-btn next" onClick={nextPortfolio}>{'›'}</button>
                                </div>
                            </div>
                            <div className="carousel-description">
                                <p>{portfolioItems[activePortfolio].description}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <div className="container">
                        <h2 className="section-title reveal">Our Services</h2>
                        <div className="services-grid">
                            {servicesData.map((service, index) => (
                                <div 
                                    className="service-card reveal" 
                                    key={index}
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <div className="service-icon-large">{service.icon}</div>
                                    <h3 className="service-title">{service.title}</h3>
                                    <div className="service-stats-row">
                                        {Object.entries(service.stats).map(([key, value]) => (
                                            <span key={key} className="service-stat">
                                                <strong>{value}</strong> {key}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-features">
                                        {service.features.map((feature, idx) => (
                                            <span key={idx} className="feature-tag">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

               
                {/* Booking Form Section */}
                <section className="booking-section">
                    <div className="container">
                        <div className="booking-content reveal">
                            <div className="booking-info">
                                <h2 className="booking-title">Ready to Amplify Your Brand?</h2>
                                <p className="booking-text">
                                    Let's discuss your campaign objectives and find the perfect outdoor placements 
                                    for your brand. Our team will provide customized media plans with site options, 
                                    creative recommendations, and transparent pricing.
                                </p>
                                <div className="booking-benefits">
                                    <div className="benefit-item">✓ Free site recommendations</div>
                                    <div className="benefit-item">✓ Custom media plans</div>
                                    <div className="benefit-item">✓ Transparent pricing</div>
                                    <div className="benefit-item">✓ Creative consultation</div>
                                </div>
                            </div>
                            <form className="booking-form" onSubmit={handleSubmit}>
                                <input 
                                    type="text" 
                                    name="name"
                                    placeholder="Your Name" 
                                    className="form-input"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder="Email Address" 
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="tel" 
                                    name="phone"
                                    placeholder="Phone Number" 
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input 
                                    type="text" 
                                    name="company"
                                    placeholder="Company Name" 
                                    className="form-input"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                    required
                                />
                                <select 
                                    className="form-input"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Campaign Budget Range</option>
                                    <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                                    <option value="₹5-10 Lakhs">₹5-10 Lakhs</option>
                                    <option value="₹10-25 Lakhs">₹10-25 Lakhs</option>
                                    <option value="₹25 Lakhs+">₹25 Lakhs+</option>
                                </select>
                                <textarea 
                                    placeholder="Campaign Details" 
                                    className="form-textarea"
                                    name="details"
                                    value={formData.details}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                                
                                {formStatus.success && (
                                    <div className="form-message success">
                                        ✓ Thank you! We&apos;ll contact you shortly with your media kit.
                                    </div>
                                )}
                                
                                {formStatus.error && (
                                    <div className="form-message error">
                                        ✗ Something went wrong. Please try again or contact us directly.
                                    </div>
                                )}
                                
                                <button 
                                    type="submit" 
                                    className="form-submit"
                                    disabled={formStatus.loading}
                                >
                                    {formStatus.loading ? 'Sending...' : 'Request Media Kit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Back Button */}
            <div className="back-button" onClick={navigateHome} title="Back"></div>
        </div>
    );
}

export default BrandingAdvertising;