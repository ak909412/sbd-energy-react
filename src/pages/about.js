import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './bg.jpg';
import logo from  './logo.png';

// Note: Add these to your public/index.html in the <head> section:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

// Make Leaflet available globally
const L = window.L;

// --- Data for Cards ---
const statsData = [
    { number: "22+", label: "Years of Excellence" },
    { number: "500+", label: "Project Locations" },
    { number: "10+", label: "Service Verticals" },
    { number: "Pan India", label: "Presence" }
];

const teamData = [
    { 
        name: "Satya Narayan Dalmia", 
        title: "Chairman & Managing Director", 
        description: "A visionary entrepreneur and Gold Medalist Chemical Engineer (BIT Sindri), Mr. Dalmia brings over 50 years of experience in engineering and business leadership. His strategic foresight and passion for sustainability continue to drive SBD's success." 
    },
    { 
        name: "Ajit Dalmia", 
        title: "Chief Executive Officer", 
        description: "A seasoned Finance Professional (FCA) with more than 25 years of experience in diverse fields of Internal Audit, Statutory Audit, Systems and Process Evaluation and Designing of reputed FMCG companies. Mr. Dalmia ensures strong financial governance, strategic growth, and operational excellence across all verticals." 
    }
];

const advisoryData = [
    { name: "Dr. M. Rizwan", position: "Associate Professor", affiliation: "Dept. of Electrical Engineering, Delhi Technological University" },
    { name: "Dr. I. U. Khan", position: "Retd. Chief Engineer", affiliation: "Dept. of Electrical Engineering, Madhya Pradesh Urja Vikas Nigam" }
];

const focusAreasData = [
    { icon: "🌱", title: "Green Energy & Environment", text: "Promoting renewable and eco-friendly solutions" },
    { icon: "🗺️", title: "Inclusive Development", text: "Reaching remote and underdeveloped regions" },
    { icon: "⚡", title: "EV Charging Leadership", text: "Pioneering clean mobility across India" },
    { icon: "💡", title: "Power to the Unreached", text: "Delivering electricity to marginalized communities" },
    { icon: "🔬", title: "Technological Innovation", text: "Integrating research and advanced systems" },
    { icon: "🏙️", title: "Smart Cities & Safety", text: "Empowering urban transformation" },
    { icon: "📡", title: "Telecom Networks", text: "Connecting the nation through digital infrastructure" },
];

const expertiseData = [
    { 
        icon: "💻", 
        title: "Information Technology & Smart Solutions", 
        description: "Advanced IT infrastructure and smart city implementations",
        stat: "100+ Smart Projects"
    },
    { 
        icon: "🔌", 
        title: "EV Charging Infrastructure", 
        description: "Leading provider of electric vehicle charging stations",
        stat: "500+ EV Stations"
    },
    { 
        icon: "☀️", 
        title: "Renewable Energy & Mini Grids", 
        description: "Solar power plants and sustainable energy solutions",
        stat: "50MW+ Capacity"
    },
    { 
        icon: "💧", 
        title: "Water Purification & Distribution", 
        description: "Clean water solutions for communities nationwide",
        stat: "100,000+ Lives Impacted"
    },
    { 
        icon: "🏗️", 
        title: "Civil & Road Infrastructure", 
        description: "Comprehensive infrastructure development projects",
        stat: "200+ Projects"
    },
    { 
        icon: "🌐", 
        title: "Telecom & OFC Networks", 
        description: "Optical fiber cable laying and telecom connectivity",
        stat: "Pan India Coverage"
    },
    { 
        icon: "🎨", 
        title: "Branding & Promotion", 
        description: "Brand creation and strategic promotion services",
        stat: "50+ Brands"
    }
];

const projectLocations = [
    // Delhi
    { city: "DTU, Bawana", state: "Delhi", lat: 28.8386, lng: 77.1564 },
    { city: "Jamia Millia Islamia University", state: "Delhi", lat: 28.5615, lng: 77.2804 },
    { city: "IRCTC", state: "Delhi", lat: 28.6139, lng: 77.2090 },
    { city: "President House", state: "Delhi", lat: 28.6146, lng: 77.1991 },
    { city: "MP Bungalows", state: "Delhi", lat: 28.6177, lng: 77.2093 },
    { city: "Ashoka Hotel", state: "Delhi", lat: 28.5940, lng: 77.2067 },
    { city: "Delhi Airport", state: "Delhi", lat: 28.5562, lng: 77.1000 },
    
    // Haryana
    { city: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
    { city: "Panchkula", state: "Haryana", lat: 30.6942, lng: 76.8531 },
    { city: "Sohna", state: "Haryana", lat: 28.2507, lng: 77.0652 },
    { city: "Rohtak", state: "Haryana", lat: 28.8955, lng: 76.6066 },
    { city: "Manesar", state: "Haryana", lat: 28.3614, lng: 76.9318 },
    { city: "Pataudi", state: "Haryana", lat: 28.3255, lng: 76.7785 },
    { city: "Farrukh Nagar", state: "Haryana", lat: 28.4478, lng: 76.8234 },
    { city: "Hailey Mandi", state: "Haryana", lat: 28.7741, lng: 77.0362 },
    { city: "Palwal", state: "Haryana", lat: 28.1442, lng: 77.3308 },
    
    // Rajasthan
    { city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
    
    // Bihar
    { city: "Forbesganj, Araria", state: "Bihar", lat: 26.3023, lng: 87.2650 },
    { city: "Saharsa", state: "Bihar", lat: 25.8756, lng: 86.5964 },
    { city: "Banka", state: "Bihar", lat: 24.8893, lng: 86.9239 },
    { city: "Dhoraiya", state: "Bihar", lat: 25.6500, lng: 85.9000 },
    
    // Jharkhand
    { city: "Sahebganj", state: "Jharkhand", lat: 25.2500, lng: 87.6333 },
    { city: "Pakur", state: "Jharkhand", lat: 24.6333, lng: 87.8500 },
    { city: "Hazaribagh", state: "Jharkhand", lat: 23.9929, lng: 85.3616 },
    
    // Madhya Pradesh
    { city: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
    { city: "Betul", state: "Madhya Pradesh", lat: 21.9047, lng: 77.8989 },
    { city: "Sidhi", state: "Madhya Pradesh", lat: 24.4167, lng: 81.8833 },
    { city: "Rewa", state: "Madhya Pradesh", lat: 24.5364, lng: 81.2933 },
    { city: "Jabalpur", state: "Madhya Pradesh", lat: 23.1815, lng: 79.9864 },
    { city: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
    
    // Uttar Pradesh (major cities)
    { city: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
    { city: "Kanpur", state: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
    { city: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
    { city: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
    { city: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
    
    // Assam
    { city: "Kamrup", state: "Assam", lat: 26.1433, lng: 91.7898 },
    { city: "Karbi Anglong", state: "Assam", lat: 26.0117, lng: 93.4305 },
    
    // Tamil Nadu
    { city: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
    
    // Odisha
    { city: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
    
    // Gujarat
    { city: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
    
    // Maharashtra
    { city: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
    { city: "Chhindwara", state: "Maharashtra", lat: 22.0572, lng: 78.9385 },
    
    // Sikkim
    { city: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065 },
    
    // Jammu and Kashmir
    { city: "Jammu", state: "Jammu and Kashmir", lat: 32.7266, lng: 74.8570 }
];

const certificationImages = [
    { src: "/images/about/certificates/1.jpg", alt: "Certification 1" },
    { src: "/images/about/certificates/2.jpg", alt: "Certification 2" },
    { src: "/images/about/certificates/3.jpg", alt: "Certification 3" },
    { src: "/images/about/certificates/4.jpg", alt: "Certification 4" },
    { src: "/images/about/certificates/5.jpg", alt: "Certification 5" },
    { src: "/images/about/certificates/6.jpg", alt: "Certification 6" },
];

const empanelmentImages = [
    { src: "/images/about/Empanelment/1.png", alt: "Empanelment 1" },
    { src: "/images/about/Empanelment/2.png", alt: "Empanelment 2" },
    { src: "/images/about/Empanelment/3.png", alt: "Empanelment 3" },
    { src: "/images/about/Empanelment/4.jpg", alt: "Empanelment 4" },
    { src: "/images/about/Empanelment/5.jpg", alt: "Empanelment 5" },
    { src: "/images/about/Empanelment/6.jpg", alt: "Empanelment 6" },
    { src: "/images/about/Empanelment/7.png", alt: "Empanelment 7" },
    { src: "/images/about/Empanelment/8.jpg", alt: "Empanelment 8" },
    { src: "/images/about/Empanelment/9.jpg", alt: "Empanelment 9" },
];

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

// --- Reusable Components ---
const StatCard = ({ number, label, index }) => (
    <div className="stat-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
    </div>
);

const PillarCard = ({ title, index }) => (
    <div className="pillar-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
        <h3 className="pillar-title">{title}</h3>
    </div>
);

const TeamCard = ({ name, title, description, index }) => (
    <div className="team-card reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
        <h3 className="team-name">{name}</h3>
        <p className="team-title">{title}</p>
        <p className="team-description">{description}</p>
    </div>
);

const AdvisorCard = ({ name, position, affiliation, index }) => (
    <div className="advisor-card reveal" style={{ transitionDelay: `${index * 0.15}s` }}>
        <h3 className="advisor-name">{name}</h3>
        <p className="advisor-position">{position}</p>
        <p className="advisor-affiliation">{affiliation}</p>
    </div>
);

const FocusAreaCard = ({ icon, title, text, index }) => (
    <div className="focus-card reveal" style={{ transitionDelay: `${index * 0.08}s` }}>
        <span className="focus-icon">{icon}</span>
        <h4 className="focus-title">{title}</h4>
        <p className="focus-text">{text}</p>
    </div>
);

const ExpertiseCard = ({ icon, title, description, stat, index }) => (
    <div className="expertise-card reveal" style={{ transitionDelay: `${index * 0.08}s` }}>
        <span className="expertise-icon">{icon}</span>
        <h4 className="expertise-title">{title}</h4>
        <p className="expertise-description">{description}</p>
        <div className="expertise-stat">{stat}</div>
    </div>
);

const ProjectMap = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Only initialize if map hasn't been created yet
        if (mapInstanceRef.current) return;

        // Create map centered on India
        const map = L.map(mapRef.current, {
            center: [23.5937, 78.9629], // Center of India
            zoom: 5,
            scrollWheelZoom: false,
            zoomControl: true,
        });

        mapInstanceRef.current = map;

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
        }).addTo(map);

        // Custom marker icon
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div class="marker-pin"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
        });

        // Group locations by state for better organization
        const locationsByState = {};
        projectLocations.forEach(location => {
            if (!locationsByState[location.state]) {
                locationsByState[location.state] = [];
            }
            locationsByState[location.state].push(location);
        });

        // Add markers for each location
        projectLocations.forEach(location => {
            const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
            
            // Create popup content
            const popupContent = `
                <div class="map-popup">
                    <h4>${location.city}</h4>
                    <p>${location.state}</p>
                </div>
            `;
            
            marker.bindPopup(popupContent);
        });

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div className="map-container reveal">
            <div 
                ref={mapRef} 
                className="leaflet-map"
                style={{ height: '600px', width: '100%', borderRadius: '16px' }}
            />
            <div className="map-legend">
                <div className="legend-item">
                    <span className="legend-marker"></span>
                    <span>Project Location</span>
                </div>
                <div className="legend-stats">
                    <strong>{projectLocations.length}+</strong> locations across India
                </div>
            </div>
        </div>
    );
};

const GallerySection = ({ title, images }) => (
    <section className="gallery-section">
        <h2 className="section-title reveal">{title}</h2>
        <div className="gallery-grid">
            {images.map((image, index) => (
                <div className="gallery-item reveal" key={index} style={{ transitionDelay: `${index * 0.05}s` }}>
                    <img src={image.src} alt={image.alt} className="gallery-image" />
                </div>
            ))}
        </div>
    </section>
);

const MarqueeGallery = ({ title, images }) => (
    <section className="marquee-section">
        <h2 className="section-title reveal">{title}</h2>
        <div className="marquee-container">
            <div className="marquee-content">
                {[...images, ...images].map((image, index) => (
                    <div className="marquee-item" key={index}>
                        <img src={image.src} alt={image.alt} className="marquee-image" />
                    </div>
                ))}
            </div>
        </div>
    </section>
);

// --- Main AboutPage ---
function AboutPage() {
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

    const navigateToAwards = () => {
        navigate('/awards');
    };

    const navigateToContact = () => {
        navigate('/contact');
    };
    
    const navigateToAbout = () => {
        navigate('/about');
    };

    const navigateToSocial = () => {
        navigate('/social');
    };

    const navigateToAPress = () => {
        navigate('/press');
    };

    return (
        <div className="AboutPage">
            <ThreeBackground/>
            
            <section className="hero-section" id="top" style={{ transform: `translateY(-${heroTransform}px)`,backgroundImage: `url(${bgImage})` }}>
                <div className="hero-content-wrapper">
                    <h1 className="hero-headline reveal-hero">About <span className="highlight">SBD Group</span></h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Leading the Way in Sustainable Innovation Since 2002
                    </p>
                </div>
            </section>

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
                <section className="overview-section">
                    <div className="overview-container">
                        <div className="overview-content">
                            <p className="section-text reveal">
                                Established in 2002, SBD Group is a dynamic organization with a diversified portfolio spanning across India. 
                                We are a trusted solution provider in Information Technology and Sustainable Infrastructure, offering 
                                cutting-edge services in Surveillance & Smart City Solutions (IT & ICCC), EV Charging Infrastructure, 
                                Water Purification & Distribution Networks, Civil & Road Infrastructure, Optical Fibre Cable Laying & 
                                Telecom Networks, Renewable Energy Solutions (Solar Power Plants, Mini Grids, Street Lighting, Water Heating 
                                Systems), Brand Creation & Promotion, and Film Production.
                            </p>
                            <div className="highlight-box reveal" style={{ transitionDelay: '0.1s' }}>
                                <p className="highlight-text">
                                    For over two decades, SBD Group has been at the forefront of green innovation, delivering transformative 
                                    solutions that uplift the most underserved communities, even in the remotest and hardest-to-reach regions 
                                    of India. From bringing clean electricity and purified drinking water to the unreached, to deploying 
                                    cutting-edge pollution control and sustainability technologies, we have remained steadfast in our mission 
                                    to empower lives, protect the environment, and drive progress with purpose.
                                </p>
                            </div>
                            <p className="section-text reveal" style={{ transitionDelay: '0.2s' }}>
                                SBD Group has successfully executed green energy projects across <strong>500+ locations</strong> in 
                                collaboration with State Governments, PSUs, and Nodal Agencies. Each project reflects our dedication 
                                to building a sustainable and equitable future.
                            </p>
                        </div>
                        <div className="overview-image-container reveal" style={{ transitionDelay: '0.3s' }}>
                            <img src="/images/about/t1.jpg" alt="SBD Energy Projects" className="overview-image" />
                        </div>
                    </div>
                </section>

                <section className="stats-section">
                    <h2 className="section-title reveal">Our Journey in Numbers</h2>
                    <div className="stats-grid">
                        {statsData.map((stat, index) => <StatCard key={stat.label} {...stat} index={index} />)}
                    </div>
                </section>
                
                <section className="mission-section">
                    <h2 className="section-title reveal">Our Mission</h2>
                    <p className="mission-text reveal" style={{ transitionDelay: '0.1s' }}>
                        At SBD Group, our mission is to Create, Innovate, Research, Formulate, Integrate, and Transform Ideas into 
                        impactful solutions that make life easier and greener for generations to come. We strive to enhance the quality 
                        of life through sustainable innovation—building smarter cities, cleaner energy systems, and better community services.
                    </p>
                    <div className="pillars-grid">
                        {["Better Atmosphere", "Better Community Services", "Better Personalized Solutions"].map((title, index) => (
                            <PillarCard key={title} title={title} index={index} />
                        ))}
                    </div>
                </section>

                <section className="vision-highlight reveal">
                    <p className="vision-text">
                        "To be recognized as the most reputed EV Charging Infrastructure & IT Solutions Provider by 2030"
                    </p>
                </section>

                <section className="focus-section">
                    <h2 className="section-title reveal">Our Focus Areas</h2>
                    <div className="focus-grid">
                        {focusAreasData.map((focus, index) => (
                            <FocusAreaCard key={index} {...focus} index={index} />
                        ))}
                    </div>
                </section>

                <section className="expertise-section">
                    <h2 className="section-title reveal">Our Expertise</h2>
                    <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                        Delivering comprehensive solutions across multiple domains
                    </p>
                    <div className="expertise-grid">
                        {expertiseData.map((expertise, index) => (
                            <ExpertiseCard key={index} {...expertise} index={index} />
                        ))}
                    </div>
                </section>

                <section className="project-map-section">
                    <h2 className="section-title reveal">Our Project Footprint Across India</h2>
                    <p className="section-subtitle reveal" style={{ transitionDelay: '0.1s' }}>
                        500+ projects delivered across 14 states, transforming communities nationwide
                    </p>
                    <ProjectMap />
                </section>

                <GallerySection title="Our Certifications" images={certificationImages} />
                <MarqueeGallery title="Our Empanelments" images={empanelmentImages} />

                <section className="management-section">
                    <h2 className="section-title reveal">Leadership & Management</h2>
                    <div className="management-grid">
                        {teamData.map((member, index) => <TeamCard key={member.name} {...member} index={index} />)}
                    </div>
                </section>

                <section className="advisory-section">
                    <h2 className="section-title reveal">Advisory Committee</h2>
                    <div className="advisory-grid">
                         {advisoryData.map((advisor, index) => <AdvisorCard key={advisor.name} {...advisor} index={index} />)}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AboutPage;