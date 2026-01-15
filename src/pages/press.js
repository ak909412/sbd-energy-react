import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './press.css';

// Press & Media Data
const pressData = [
    {
        id: "batkuma",
        title: "Batkuma Initiative",
        subtitle: "Transforming Rural Communities",
        description: "SBD Energy's Batkuma initiative represents our commitment to sustainable rural development. Through innovative solutions and community partnerships, we're bringing transformative change to remote villages, improving infrastructure, and creating opportunities for growth and prosperity.",
        icon: "🏘️",
        images: [
            "/images/press/batkuma1.jpg",
            "/images/press/batkuma2.jpg",
            "/images/press/batkuma3.jpg",
            "/images/press/batkuma4.jpg",
            "/images/press/batkuma5.jpg"
        ]
    },
    {
        id: "covid",
        title: "COVID-19 Response",
        subtitle: "Standing Together in Crisis",
        description: "During the unprecedented COVID-19 pandemic, SBD Energy mobilized resources to support communities across India. Our relief efforts included distributing essential supplies, providing medical equipment to hospitals, and supporting healthcare workers on the frontlines.",
        icon: "🏥",
        images: [
            "/images/press/covid1.jpg",
            "/images/press/covid2.jpg",
            "/images/press/covid3.jpg",
            "/images/press/covid4.jpg",
            "/images/press/covid5.jpg"
        ]
    },
    {
        id: "ev-charging",
        title: "EV Charging Infrastructure",
        subtitle: "Powering the Electric Future",
        description: "SBD Energy is at the forefront of India's electric vehicle revolution. Our expanding network of EV charging stations is making sustainable transportation accessible across urban and rural areas, contributing to a cleaner, greener future for generations to come.",
        icon: "⚡",
        images: [
            "/images/press/ev1.jpg",
            "/images/press/ev2.jpg",
            "/images/press/ev3.jpg",
            "/images/press/ev4.jpg",
            "/images/press/ev5.jpg"
        ]
    },
    {
        id: "fauja-film",
        title: "Fauja Film News",
        subtitle: "Stories That Inspire",
        description: "Our film production venture brings inspiring stories to the screen. The Fauja film project showcases remarkable journeys of determination and triumph, reflecting SBD Group's commitment to celebrating human spirit and creating content that moves audiences worldwide.",
        icon: "🎬",
        images: [
            "/images/press/fauja1.jpg",
            "/images/press/fauja2.jpg",
            "/images/press/fauja3.jpg",
            "/images/press/fauja4.jpg",
            "/images/press/fauja5.jpg"
        ]
    },
    {
        id: "paralympics",
        title: "Paralympic Support",
        subtitle: "Champions Beyond Limits",
        description: "SBD Energy proudly supports India's Paralympic athletes — true embodiments of courage, determination, and excellence. Our Paralympic initiative provides financial assistance, training support, and sponsorship to differently-abled athletes pursuing their Olympic dreams.",
        icon: "🏅",
        images: [
            "/images/press/paralympics1.jpg",
            "/images/press/paralympics2.jpg",
            "/images/press/paralympics3.jpg",
            "/images/press/paralympics4.jpg",
            "/images/press/paralympics5.jpg"
        ]
    },
    {
        id: "psg",
        title: "PSG Partnership",
        subtitle: "Global Sports Collaboration",
        description: "SBD Group's partnership with Paris Saint-Germain represents our commitment to excellence in sports and global collaboration. This prestigious association brings world-class football experiences and developmental programs to Indian sports enthusiasts.",
        icon: "⚽",
        images: [
            "/images/press/psg1.jpg",
            "/images/press/psg2.jpg",
            "/images/press/psg3.jpg",
            "/images/press/psg4.jpg",
            "/images/press/psg5.jpg"
        ]
    },
    {
        id: "ram-mandir",
        title: "Ram Mandir Contribution",
        subtitle: "A Sacred Heritage Restored",
        description: "SBD Energy was honored to contribute to the historic construction of the Ram Mandir in Ayodhya — a symbol of India's rich cultural heritage and spiritual legacy. Our contribution represents our deep respect for the nation's traditions and commitment to preserving cultural landmarks.",
        icon: "🛕",
        images: [
            "/images/press/rammandir1.jpg",
            "/images/press/rammandir2.jpg",
            "/images/press/rammandir3.jpg",
            "/images/press/rammandir4.jpg",
            "/images/press/rammandir5.jpg"
        ]
    },
    {
        id: "utkrisht",
        title: "Utkrisht Program",
        subtitle: "Excellence in Education",
        description: "Utkrisht — meaning 'excellence' — is SBD Energy's flagship educational initiative. Through scholarships, skill development programs, and mentorship opportunities, we're empowering underprivileged youth with the tools they need to build successful futures.",
        icon: "📚",
        images: [
            "/images/press/utkrisht1.jpg",
            "/images/press/utkrisht2.jpg",
            "/images/press/utkrisht3.jpg",
            "/images/press/utkrisht4.jpg",
            "/images/press/utkrisht5.jpg"
        ]
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

function Press() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [activeImageModal, setActiveImageModal] = useState(null);

    // Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
        
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Navigation functions (Updated to match AboutPage logic)
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

    const navigateToAbout = () => navigate('/about');
    const navigateToContact = () => navigate('/contact');
    const navigateToAwards = () => navigate('/awards');
    const navigateToSocial = () => navigate('/social');
    const navigateToAPress = () => navigate('/press');

    // Image modal handlers
    const openImageModal = (src) => setActiveImageModal(src);
    const closeImageModal = () => setActiveImageModal(null);

    return (
        <div className="PressPage">
            {/* Image Modal */}
            {activeImageModal && (
                <div className="press-image-modal" onClick={closeImageModal}>
                    <div className="press-modal-content">
                        <img src={activeImageModal} alt="Enlarged view" />
                        <button className="press-modal-close" onClick={closeImageModal}>×</button>
                    </div>
                </div>
            )}

            {/* Navigation (Updated to match AboutPage exact structure) */}
            <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-links">
                    <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); navigateHome(); }}>Home</a>
                    <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>About</a>
                    <a href="/awards" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAwards(); }}>Achievements</a>
                    <a href="/social" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToSocial(); }}>Social Welfare</a>
                    <a href="/press" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAPress(); }}>Press</a>
                    <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToContact(); }}>Contact</a>
                </div>
            </nav>

            {/* Back Button (Updated to match AboutPage exact structure) */}
            <div className="back-button" onClick={navigateHome} title="Back"></div>

            {/* Hero Section */}
            <section className="press-hero">
                <div className="press-hero-overlay"></div>
                <div className="press-hero-content">
                    <div className="press-hero-badge">Media & Communications</div>
                    <h1 className="press-hero-title reveal">
                        Press <span className="press-highlight">&</span> Media
                    </h1>
                    <p className="press-hero-subtitle reveal">
                        Discover the stories, achievements, and milestones that define SBD Energy's journey 
                        through media coverage and press releases.
                    </p>
                </div>
                <div className="press-hero-scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="press-scroll-arrow"></div>
                </div>
            </section>

            <main className="press-main-content">

                {/* Press Releases Section */}
                <section className="press-releases-section" id="releases">
                    <div className="press-container">
                        <div className="press-section-header reveal">
                            <span className="press-section-tag">Coverage</span>
                            <h2 className="press-section-title">In The News</h2>
                            <p className="press-section-desc">Explore our media presence and press coverage across various initiatives</p>
                        </div>
                        
                        {pressData.map((item, index) => (
                            <div 
                                className="press-block reveal"
                                key={item.id}
                                id={item.id}
                                style={{ transitionDelay: `${index * 0.05}s` }}
                            >
                                <div className="press-glass-panel">
                                    {/* Header */}
                                    <div className="press-block-header">
                                        <div className="press-icon-container">
                                            <span className="press-icon">{item.icon}</span>
                                        </div>
                                        <div className="press-title-group">
                                            <h3 className="press-block-title">{item.title}</h3>
                                            <span className="press-block-subtitle">{item.subtitle}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="press-block-description">{item.description}</p>
                                    
                                    {/* Image Gallery */}
                                    <div className="press-gallery">
                                        {item.images.map((img, imgIndex) => (
                                            <div 
                                                key={imgIndex} 
                                                className={`press-gallery-item ${imgIndex === 0 ? 'featured' : ''}`}
                                                onClick={() => openImageModal(img)}
                                            >
                                                <img src={img} alt={`${item.title} ${imgIndex + 1}`} />
                                                <div className="press-image-overlay">
                                                    <span className="press-zoom-icon">🔍</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Press Section */}
                <section className="press-contact-section reveal">
                    <div className="press-contact-container">
                        <div className="press-contact-content">
                            <h2 className="press-contact-title">Media Inquiries</h2>
                            <p className="press-contact-text">
                                For press releases, media kits, and interview requests, please contact our communications team.
                            </p>
                            <a href="mailto:press@sbdenergy.com" className="press-contact-btn">
                                Contact Press Team
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="press-footer">
                <div className="press-footer-content">
                    <p>© {new Date().getFullYear()} SBD Energy. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Press;