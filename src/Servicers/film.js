import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './film.css';
import ThreeBackground from '../components/ThreeBackground';
/**
 * FORMSPREE SETUP INSTRUCTIONS:
 * Replace 'YOUR_FORM_ID' in the handleSubmit function with your actual Formspree form ID
 */

// Featured Film Data - Fouja
const featuredFilm = {
    title: "Fouja",
    year: 2023,
    language: "Hindi",
    director: "Pramod Kumar Punhana",
    producer: "Ajit Dalmia (Raahi Production JV)",
    writers: ["Pravesh Rajput", "Akash Singh"],
    cast: ["Karthik Dammu", "Pavan Malhotra", "Aishwarya Sanjay Singh"],
    plotSummary: "A compelling army drama exploring duty, familial sacrifice and personal redemption. Set against the backdrop of military life, Fouja delves deep into the emotional complexities of service members and their families, weaving together themes of honor, loss, and the enduring human spirit.",
    accolades: [
        { award: "National Film Award", category: "Best Supporting Actor", year: 2023 },
        { award: "National Film Award", category: "Best Debut Director", year: 2023 },
        { award: "National Film Award", category: "Best Lyrics", year: 2023 }
    ],
    poster: "/images/film/f1.jpg",
    gallery: [
        "/images/film/f2.jpg",
        "/images/film/f3.jpg",
        "/images/film/f4.jpg"
    ],
    trailer: "https://www.youtube.com/embed/YOUR_TRAILER_ID"
};

// Services Data
const servicesData = [
    {
        title: "Feature Film Production",
        description: "End-to-end production services for feature-length films across genres. We handle everything from initial concept development to final distribution, ensuring creative vision meets commercial viability. Our team brings together experienced directors, cinematographers, and production designers to craft compelling narratives that resonate with audiences. We specialize in character-driven stories with strong emotional cores, backed by meticulous production planning and budget discipline.",
        icon: "🎬",
        capabilities: ["Script development", "Casting", "Location scouting", "Full crew", "Post-production"]
    },
    {
        title: "Documentaries & Non-Fiction",
        description: "Powerful documentary storytelling that captures real-world narratives with authenticity and impact. From social issue documentaries to biographical films, we bring journalistic rigor and cinematic excellence to non-fiction content. Our documentary work combines extensive research, sensitive subject handling, and visual storytelling techniques that engage and inform audiences while maintaining the highest ethical standards.",
        icon: "📽️",
        capabilities: ["Research", "Interviews", "Archival footage", "Narration", "Festival strategy"]
    },
    {
        title: "Co-Production Partnerships",
        description: "Strategic co-production collaborations with studios, production houses, and independent filmmakers. We bring financial expertise, production infrastructure, and distribution networks to collaborative projects. Our partnership model offers flexible arrangements from line production services to full co-production with creative input, ensuring mutual success and risk mitigation.",
        icon: "🤝",
        capabilities: ["Joint ventures", "Financial planning", "Production support", "Distribution", "Marketing"]
    },
    {
        title: "Production Management",
        description: "Comprehensive production management services ensuring projects stay on schedule and within budget. Our experienced production managers handle day-to-day operations, crew coordination, vendor management, and financial controls. We implement robust systems for tracking costs, managing schedules, and maintaining quality standards throughout the production lifecycle.",
        icon: "📋",
        capabilities: ["Budget control", "Schedule management", "Vendor coordination", "Legal compliance", "Quality assurance"]
    }
];

// Why Partner Data
const partnershipBenefits = [
    {
        icon: "🏆",
        title: "Award-Winning Leadership",
        description: "Led by Ajit Dalmia, our team brings proven creative vision and production expertise with national recognition"
    },
    {
        icon: "💼",
        title: "Financial Discipline",
        description: "Rigorous budget management and financial controls ensuring projects deliver maximum value"
    },
    {
        icon: "🎭",
        title: "Creative Excellence",
        description: "Collaborative approach with seasoned directors, writers and technicians delivering artistic integrity"
    },
    {
        icon: "🌟",
        title: "Festival & Distribution Success",
        description: "Strong track record in film festivals, awards circuits, and securing distribution partnerships"
    }
];

// Stats Data
const statsData = [
    { number: "3", label: "National Film Awards", icon: "🏆" },
    { number: "5+", label: "Feature Productions", icon: "🎬" },
    { number: "15+", label: "Festival Selections", icon: "🎭" },
    { number: "100%", label: "On-Budget Delivery", icon: "💯" }
];

// Awards Gallery Data
const awardsGallery = [
    {
        id: 1,
        image: "/images/film/is.jpg",
        name: "'COLLABORATING WITH TALENTED PRODUCERS AT THE AWARD FUNCTION—AN INSPIRING EXPERIENCE!'",
        size: "large"
    },
    {
        id: 2,
        image: "/images/film/a1.png",
        name: "PAVAN MALHOTRA NATIONAL FILM AWARD FOR BEST SUPPORTING ACTOR",
        size: "small"
    },
    {
        id: 3,
        image: "/images/film/a2.png",
        name: "PRAMOD KUMAR NATIONAL FILM AWARD FOR BEST DEBUT FILM OF A DIRECTOR",
        size: "small"
    },
    {
        id: 4,
        image: "/images/film/a3.png",
        name: "NAUSHAD SADAR KHAN NATIONAL FILM AWARD FOR BEST LYRICS",
        size: "small"
    }
];

// Press Kit Items
const pressKitItems = [
    { name: "Production Overview", file: "raahi-production-overview.pdf", size: "2.3 MB" },
    { name: "Fouja Press Kit", file: "fouja-press-kit.pdf", size: "5.8 MB" },
    { name: "High-Res Images", file: "fouja-images.zip", size: "45 MB" },
    { name: "Awards & Recognition", file: "awards-recognition.pdf", size: "1.2 MB" }
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

function FilmProduction() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        projectType: '',
        budget: '',
        link: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: false });

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

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
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    projectType: formData.projectType,
                    budget: formData.budget,
                    link: formData.link,
                    message: formData.message
                })
            });

            if (response.ok) {
                setFormStatus({ loading: false, success: true, error: false });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    projectType: '',
                    budget: '',
                    link: '',
                    message: ''
                });
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
        <div className="FilmProductionPage">
            <ThreeBackground/>
            {/* Navigation */}
            <nav className={`film-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="logo" onClick={navigateHome}>SBD Energy</div>
                    <div className="nav-links">
                        <a href="/" className="nav-link">Home</a>
                        <a href="/films" className="nav-link">Films</a>
                        <a href="/services" className="nav-link">Services</a>
                        <a href="/about" className="nav-link">About</a>
                        <a href="/contact" className="nav-link">Contact</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-film-reel">
                    <div className="reel-overlay"></div>
                    <div className="reel-grain"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge reveal-hero">Award-Winning Production</div>
                    <h1 className="hero-headline reveal-hero" style={{ transitionDelay: '0.1s' }}>
                        Raahi Production<br />
                        <span className="highlight">Cinematic Storytelling with Impact</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Producing award-winning films with strong creative vision and disciplined production execution.
                    </p>
                    <div className="hero-cta-group reveal-hero" style={{ transitionDelay: '0.3s' }}>
                        <button className="cta-button primary" onClick={() => setShowModal(true)}>
                            View Showreel
                        </button>
                        <button className="cta-button secondary">Connect With Producers</button>
                    </div>
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
                            <h2 className="section-title">Our Production Philosophy</h2>
                            <p className="overview-text">
                                Raahi Production, led by Ajit Dalmia, produces content that resonates. Our production 
                                process combines creative storytelling, strict budget discipline and technical excellence. 
                                Our collaborative approach brings together seasoned directors, writers and technicians to 
                                deliver films that reach audiences and critics alike.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Featured Film - Fouja */}
                <section className="featured-film-section">
                    <div className="container">
                        <h2 className="section-title reveal">Featured Production</h2>
                        <div className="film-showcase reveal">
                            <div className="film-poster-container">
                                <img src={featuredFilm.poster} alt={featuredFilm.title} className="film-poster" />
                                <div className="awards-overlay">
                                    <div className="award-badge-large">
                                        <span className="award-number">3</span>
                                        <span className="award-text">National Film Awards</span>
                                    </div>
                                </div>
                            </div>
                            <div className="film-details">
                                <div className="film-header">
                                    <h3 className="film-title">{featuredFilm.title}</h3>
                                    <div className="film-meta">
                                        <span className="meta-item">{featuredFilm.year}</span>
                                        <span className="meta-separator">•</span>
                                        <span className="meta-item">{featuredFilm.language}</span>
                                    </div>
                                </div>

                                <div className="film-credits">
                                    <div className="credit-item">
                                        <span className="credit-label">Director</span>
                                        <span className="credit-value">{featuredFilm.director}</span>
                                    </div>
                                    <div className="credit-item">
                                        <span className="credit-label">Producer</span>
                                        <span className="credit-value">{featuredFilm.producer}</span>
                                    </div>
                                    <div className="credit-item">
                                        <span className="credit-label">Writers</span>
                                        <span className="credit-value">{featuredFilm.writers.join(", ")}</span>
                                    </div>
                                    <div className="credit-item">
                                        <span className="credit-label">Cast</span>
                                        <span className="credit-value">{featuredFilm.cast.join(", ")}</span>
                                    </div>
                                </div>

                                <div className="film-synopsis">
                                    <h4 className="synopsis-title">Synopsis</h4>
                                    <p className="synopsis-text">{featuredFilm.plotSummary}</p>
                                </div>

                                <div className="film-accolades">
                                    <h4 className="accolades-title">Accolades</h4>
                                    <div className="accolades-list">
                                        {featuredFilm.accolades.map((accolade, index) => (
                                            <div key={index} className="accolade-item">
                                                <span className="accolade-icon">🏆</span>
                                                <div className="accolade-info">
                                                    <span className="accolade-award">{accolade.award}</span>
                                                    <span className="accolade-category">{accolade.category}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button className="watch-trailer-btn" onClick={() => setShowModal(true)}>
                                    Watch Trailer
                                </button>
                            </div>
                        </div>

                        {/* Film Gallery */}
                        <div className="film-gallery reveal">
                            <h4 className="gallery-title">Behind the Scenes</h4>
                            <div className="gallery-grid">
                                {featuredFilm.gallery.map((image, index) => (
                                    <div key={index} className="gallery-item" onClick={() => setActiveGalleryImage(index)}>
                                        <img src={image} alt={`${featuredFilm.title} ${index + 1}`} />
                                        <div className="gallery-overlay">
                                            <span className="gallery-icon"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Awards Gallery Section */}
                <section className="awards-gallery-section">
                    <div className="container">
                        <h2 className="section-title reveal">Awards & Recognition</h2>
                        <div className="awards-gallery-grid reveal">
                            {/* Large Award Image */}
                            <div className="award-large">
                                <div className="award-image-wrapper">
                                    <img src={awardsGallery[0].image} alt={awardsGallery[0].name} />
                                    <div className="award-overlay">
                                        <span className="award-name">{awardsGallery[0].name}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Small Award Images */}
                            <div className="awards-small-row">
                                {awardsGallery.slice(1).map((award) => (
                                    <div key={award.id} className="award-small">
                                        <div className="award-image-wrapper">
                                            <img src={award.image} alt={award.name} />
                                            <div className="award-overlay">
                                                <span className="award-name">{award.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="services-section">
                    <div className="container">
                        <h2 className="section-title reveal">Production Capabilities</h2>
                        <div className="services-grid">
                            {servicesData.map((service, index) => (
                                <div className="service-card reveal" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="service-icon-large">{service.icon}</div>
                                    <h3 className="service-title">{service.title}</h3>
                                    <p className="service-description">{service.description}</p>
                                    <div className="service-capabilities">
                                        {service.capabilities.map((capability, idx) => (
                                            <span key={idx} className="capability-tag">{capability}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Why Partner Section */}
                <section className="partnership-section">
                    <div className="container">
                        <h2 className="section-title reveal">Why Partner with Raahi Production</h2>
                        <div className="benefits-grid">
                            {partnershipBenefits.map((benefit, index) => (
                                <div className="benefit-card reveal" key={index} style={{ transitionDelay: `${index * 0.1}s` }}>
                                    <div className="benefit-icon">{benefit.icon}</div>
                                    <h3 className="benefit-title">{benefit.title}</h3>
                                    <p className="benefit-description">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Collaboration Form Section */}
                <section className="collaboration-section">
                    <div className="container">
                        <div className="collaboration-content reveal">
                            <div className="collaboration-info">
                                <h2 className="collaboration-title">Let's Create Together</h2>
                                <p className="collaboration-text">
                                    Whether you're a filmmaker with a compelling story, a studio seeking co-production 
                                    partners, or talent looking to collaborate, we'd love to hear from you. Share your 
                                    project vision and let's explore how Raahi Production can bring it to life.
                                </p>
                                <div className="collaboration-benefits">
                                    <div className="collab-benefit">✓ Creative consultation</div>
                                    <div className="collab-benefit">✓ Budget planning</div>
                                    <div className="collab-benefit">✓ Production support</div>
                                    <div className="collab-benefit">✓ Distribution strategy</div>
                                </div>
                            </div>
                            <form className="collaboration-form" onSubmit={handleSubmit}>
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
                                    placeholder="Company / Studio"
                                    className="form-input"
                                    value={formData.company}
                                    onChange={handleInputChange}
                                />
                                <select
                                    className="form-input"
                                    name="projectType"
                                    value={formData.projectType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Project Type</option>
                                    <option value="Feature Film">Feature Film</option>
                                    <option value="Documentary">Documentary</option>
                                    <option value="Co-Production">Co-Production</option>
                                    <option value="Other">Other</option>
                                </select>
                                <select
                                    className="form-input"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Budget Range</option>
                                    <option value="Under ₹1 Cr">Under ₹1 Cr</option>
                                    <option value="₹1-5 Cr">₹1-5 Cr</option>
                                    <option value="₹5-10 Cr">₹5-10 Cr</option>
                                    <option value="₹10 Cr+">₹10 Cr+</option>
                                </select>
                                <input
                                    type="url"
                                    name="link"
                                    placeholder="Portfolio/Showreel Link (optional)"
                                    className="form-input"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                />
                                <textarea
                                    placeholder="Tell us about your project"
                                    className="form-textarea"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>

                                {formStatus.success && (
                                    <div className="form-message success">
                                        ✓ Thank you! We'll be in touch soon to discuss your project.
                                    </div>
                                )}

                                {formStatus.error && (
                                    <div className="form-message error">
                                        ✗ Something went wrong. Please try again or email us directly.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="form-submit"
                                    disabled={formStatus.loading}
                                >
                                    {formStatus.loading ? 'Sending...' : 'Submit Inquiry'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>

            {/* Video Modal */}
            {showModal && (
                <div className="video-modal" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        <div className="video-container">
                            <iframe
                                src={featuredFilm.trailer}
                                title={`${featuredFilm.title} Trailer`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Back Button */}
            <div className="back-button" onClick={navigateHome} title="Back"></div>
        </div>
    );
}

export default FilmProduction;