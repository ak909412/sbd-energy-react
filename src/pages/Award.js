import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Award.css';
import ThreeBackground from '../components/ThreeBackground';
import logo from './logo.png';

// --- Awards Data ---
const awardsData = {
    main: { src: '/images/awards/rec.jpg', title: 'Major Achievement Award 2024', alt: 'Main Award' },
    subMain: [
        { src: '/images/awards/m1.jpg', title: 'Indian Achiever 2009', alt: 'Sub Award 1' },
        { src: '/images/awards/m2.jpg', title: 'Indian Achiever 2019', alt: 'Sub Award 2' },
        { src: '/images/awards/me.png', title: 'National Excellence Award', alt: 'Sub Award 3' }
    ],
    regular: [
        { src: '/images/awards/1.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/2.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/3.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/4.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/5.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/6.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/7.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/8.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/9.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/10.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/11.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/12.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/13.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/14.png', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/15.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/16.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/17.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
        { src: '/images/awards/18.jpg', title: 'Excellence in Green Energy', alt: 'Sub Award 1' },
    ]
};

// --- Scroll Reveal Hook ---
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

// --- 3D Tilt Effect Hook ---
const use3DTilt = (ref) => {
    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleMouseLeave = () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [ref]);
};

// --- Main Award Card Component ---
const MainAwardCard = ({ award }) => {
    const cardRef = useRef(null);
    use3DTilt(cardRef);

    return (
        <div className="main-award-container reveal">
            <div className="main-award-card" ref={cardRef}>
                <div className="award-glow"></div>
                <img src={award.src} alt={award.alt} className="main-award-image" />
                <div className="main-award-overlay">
                    <h3 className="main-award-title">{award.title}</h3>
                </div>
            </div>
        </div>
    );
};

// --- Sub Main Award Card Component ---
const SubMainAwardCard = ({ award, index }) => {
    const cardRef = useRef(null);
    use3DTilt(cardRef);

    return (
        <div 
            className="sub-award-card reveal" 
            style={{ transitionDelay: `${index * 0.15}s` }}
            ref={cardRef}
        >
            <div className="sub-award-inner">
                <div className="award-glow-small"></div>
                <img src={award.src} alt={award.alt} className="sub-award-image" />
                <div className="sub-award-overlay">
                    <h3 className="sub-award-title">{award.title}</h3>
                </div>
            </div>
        </div>
    );
};

// --- Regular Award Card Component ---
const RegularAwardCard = ({ award, index }) => {
    const cardRef = useRef(null);
    
    useEffect(() => {
        const element = cardRef.current;
        if (!element) return;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        };

        const handleMouseLeave = () => {
            element.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
        };

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div 
            className="regular-award-card reveal" 
            style={{ transitionDelay: `${index * 0.05}s` }}
            ref={cardRef}
        >
            <div className="regular-award-inner">
                <img src={award.src} alt={award.alt} className="regular-award-image" />
            </div>
        </div>
    );
};

// --- Main Awards Page ---
function AwardsPage() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);

    // ✅ Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            setHeroTransform(scrollY * 1.5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ Navigation functions
    // const navigateHome = () => {
    //     const returnScrollPosition = sessionStorage.getItem('returnScrollPosition');
    //     const returnHash = sessionStorage.getItem('currentHash');
        
    //     navigate('/', {
    //         state: {
    //             scrollPosition: returnScrollPosition,
    //             hash: returnHash
    //         }
    //     });
    // };

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

    const navigateToSocial = () => {
        navigate('/social');
    };

    const navigateToAPress = () => {
        navigate('/press');
    };

    return (
        <div className="AwardsPage">
            <ThreeBackground />
            <nav className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
                {/* <div className="logo" onClick={navigateHome}>
                    <img src={logo} alt="SBD Energy" />
                </div> */}
                <div className="nav-links">
                    <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); navigateHome(); }}>Home</a>
                    <a href="/about" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAbout(); }}>About</a>
                    <a href="/awards" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAwards(); }}>Achievements</a>
                    <a href="/social" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToSocial(); }}>Social Welfare</a>
                    <a href="/press" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToAPress(); }}>Press</a>
                    <a href="/contact" className="nav-link" onClick={(e) => { e.preventDefault(); navigateToContact(); }}>Contact</a>
                    
                </div>
            </nav>

            <div className="back-button" onClick={navigateHome} title="Back"></div>

            <main className="content">
                <section className="hero-section" style={{ transform: `translateY(-${heroTransform}px)` }}>
                    <div className="hero-decoration-top"></div>
                    <div className="hero-decoration-bottom"></div>
                    {/* <div className="trophy-icon reveal-hero">🏆</div> */}
                    <h1 className="hero-headline reveal-hero">
                        Our <span className="highlight">Achievements</span>
                    </h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Celebrating Excellence in Sustainable Innovation
                    </p>
                    <div className="hero-stats reveal-hero" style={{ transitionDelay: '0.3s' }}>
                        <div className="hero-stat-item">
                            <span className="stat-number">20+</span>
                            <span className="stat-label">Awards</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="stat-number">2009</span>
                            <span className="stat-label">Since</span>
                        </div>
                        <div className="hero-stat-item">
                            <span className="stat-number">National</span>
                            <span className="stat-label">Recognition</span>
                        </div>
                    </div>
                </section>

                <section className="main-award-section">
                    <MainAwardCard award={awardsData.main} />
                </section>

                <section className="sub-awards-section">
                    <h2 className="section-title reveal">Featured Recognitions</h2>
                    <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                        Our key achievements in sustainable innovation
                    </p>
                    <div className="sub-awards-grid">
                        {awardsData.subMain.map((award, index) => (
                            <SubMainAwardCard key={index} award={award} index={index} />
                        ))}
                    </div>
                </section>

                <section className="regular-awards-section">
                    <h2 className="section-title reveal">Our Certificates</h2>
                    <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                        A showcase of our continued commitment to excellence
                    </p>
                    <div className="regular-awards-grid">
                        {awardsData.regular.map((award, index) => (
                            <RegularAwardCard 
                                key={index} 
                                award={award} 
                                index={index}
                            />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AwardsPage;