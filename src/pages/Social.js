import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Social.css';
import ThreeBackground from '../components/ThreeBackground';

// Social Welfare Initiatives Data
const initiativesData = [
    {
        id: "covid",
        title: "COVID-19 Relief",
        subtitle: "Standing Strong Together",
        description: "During the unprecedented COVID-19 pandemic, SBD Energy stepped forward to support frontline workers, healthcare facilities, and vulnerable communities. Our relief efforts included distributing essential supplies, providing oxygen concentrators to hospitals, organizing vaccination camps, and supporting families who lost their livelihoods.",
        icon: "🏥",
        images: [
            "/images/social/c1.jpeg",
            "/images/social/c2.jpeg",
            "/images/social/c3.jpeg",
            "/images/social/c4.jpeg",
            "/images/social/c5.jpeg"
        ]
    },
    {
        id: "paralympic",
        title: "Paralympic Support",
        subtitle: "Champions Beyond Limits",
        description: "SBD Energy proudly supports India's Paralympic athletes — the true embodiments of courage, determination, and excellence. Our Paralympic initiative provides financial assistance, training equipment, and sponsorship to differently-abled athletes pursuing their Olympic dreams.",
        icon: "🏅",
        images: [
            "/images/social/pl1.jpg",
            "/images/social/pl2.jpg",
            "/images/social/pl3.jpg",
            "/images/social/pl4.jpg",
            "/images/social/pl5.jpg"
        ]
    },
    {
        id: "ram-mandir",
        title: "Ram Mandir Contribution",
        subtitle: "A Sacred Heritage Restored",
        description: "SBD Energy was honored to contribute to the historic construction of the Ram Mandir in Ayodhya — a symbol of India's rich cultural heritage and spiritual legacy. Our contribution represents our deep respect for the nation's traditions and our commitment to preserving cultural landmarks for future generations.",
        icon: "🛕",
        images: [
            "/images/social/rm1.jpeg",
            "/images/social/rm2.jpeg",
            "/images/social/rm3.jpeg",
            "/images/social/rm4.jpeg",
            "/images/social/rm5.jpeg"
        ]
    },
    {
        id: "plantation",
        title: "Green Earth Initiative",
        subtitle: "Planting Seeds of Tomorrow",
        description: "Our plantation drives are at the heart of SBD Energy's environmental commitment. We've organized large-scale tree plantation campaigns across urban and rural areas, engaging communities, schools, and corporate partners. Each sapling planted represents our promise to future generations.",
        icon: "🌳",
        images: [
            "/images/social/p1.jpeg",
            "/images/social/p2.jpeg",
            "/images/social/p3.jpeg",
            "/images/social/p4.jpeg",
            "/images/social/p5.jpeg"
        ]
    },
    {
        id: "utkrashit",
        title: "Utkrashit Program",
        subtitle: "Empowering Excellence",
        description: "Utkrashit — meaning 'excellence' — is SBD Energy's flagship educational and skill development program for underprivileged youth. Through scholarships, vocational training, digital literacy programs, and mentorship opportunities, we're building pathways to success for those who need it most.",
        icon: "📚",
        images: [
            "/images/social/u1.jpeg",
            "/images/social/u2.jpeg",
            "/images/social/u3.jpeg",
            "/images/social/u4.jpeg",
            "/images/social/u5.jpeg"
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

function SocialWelfare() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);
    const [activeImageModal, setActiveImageModal] = useState(null);

    // Force scroll to top when page loads
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
        <div className="SocialWelfarePage">
            <ThreeBackground />
            
            {/* Image Modal */}
            {activeImageModal && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="modal-content">
                        <img src={activeImageModal} alt="Enlarged view" />
                        <button className="modal-close" onClick={closeImageModal}>×</button>
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
            <section className="hero-section" style={{ transform: `translateY(-${heroTransform}px)` }}>
                <div className="hero-particles"></div>
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <h1 className="hero-headline reveal-hero">
                        Empowering Communities, <span className="highlight">Transforming Lives</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        At SBD Energy, we believe true success is measured not just in megawatts generated, 
                        but in the positive impact we create for society.
                    </p>
                </div>
            </section>

            <main className="main-content">

                {/* Initiatives Section */}
                <section className="initiatives-section" id="initiatives">
                    <div className="container">
                        <h2 className="section-title reveal">Our Initiatives</h2>
                        
                        {initiativesData.map((initiative, index) => (
                            <div 
                                className="initiative-block reveal"
                                key={initiative.id}
                                id={initiative.id}
                                style={{ transitionDelay: `${index * 0.05}s` }}
                            >
                                <div className="initiative-glass-panel">
                                    {/* Header */}
                                    <div className="initiative-header">
                                        <div className="initiative-icon-container">
                                            <span className="initiative-icon">{initiative.icon}</span>
                                        </div>
                                        <div className="initiative-title-group">
                                            <h3 className="initiative-title">{initiative.title}</h3>
                                            <span className="initiative-subtitle">{initiative.subtitle}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <p className="initiative-description">{initiative.description}</p>
                                    
                                    {/* Image Gallery */}
                                    <div className="initiative-gallery">
                                        {initiative.images.map((img, imgIndex) => (
                                            <div 
                                                key={imgIndex} 
                                                className={`gallery-image-card ${imgIndex === 0 ? 'featured' : ''}`}
                                                onClick={() => openImageModal(img)}
                                            >
                                                <img src={img} alt={`${initiative.title} ${imgIndex + 1}`} />
                                                <div className="image-overlay">
                                                    <span className="zoom-icon">🔍</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}

export default SocialWelfare;