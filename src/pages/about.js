import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './About.css';
import ThreeBackground from '../components/ThreeBackground';
import bgImage from './bg.jpg';
// --- Data for Cards ---

const statsData = [
    { number: "22+", label: "Years of Excellence" },
    { number: "500+", label: "Project Locations" },
    { number: "10+", label: "Service Verticals" },
    { number: "Pan India", label: "Presence" }
];

const teamData = [
    { name: "Satya Narayan Dalmia", title: "Chairman & Managing Director", description: "An Entrepreneur and Engineer for 45 years, Mr. Dalmia is a Chemical Engineer (Gold Medalist) from BIT Sindri. He excels in turning visionary ideas into reality, with a focus on projects that have a significant human and environmental impact." },
    { name: "Ajit Dalmia", title: "Chief Executive Officer", description: "A Finance Professional (FCA) with over 20 years of industry experience. His expertise in controls, systems audit, and strong corporate network provides robust financial and strategic support to the business." }
];

const advisoryData = [
    { name: "Dr. M Rizwan", position: "Associate Professor", affiliation: "Dept. of Electrical Engineering, Delhi Technological University" },
    { name: "Dr. I. U. Khan", position: "Rtd. Chief Engineer", affiliation: "Dept. of Electrical Engineering, Madhya Pradesh Urja Vikas Nigam" }
];

const contributionsData = [
    { icon: "🌱", text: "Green Energy, Environment, Infrastructure building, Pollution reduction, Drinking Water Distribution, Safety" },
    { icon: "🗺️", text: "Business even in Remote and Disturbed Locations" },
    { icon: "⚡", text: "Leader in EV Charging System (Highlighted in National and International Media)" },
    { icon: "💡", text: "Electricity to the Unreached part of the Society" },
    { icon: "🔬", text: "Technologically Innovative Solutions" },
    { icon: "🏙️", text: "Making Cities Safe and Smart" },
    { icon: "📡", text: "Creating Telecom Networks" },
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

const ContributionCard = ({ icon, text, index }) => (
    <div className="contribution-card reveal" style={{ transitionDelay: `${index * 0.08}s` }}>
        <span className="contribution-icon">{icon}</span>
        <p className="contribution-text">{text}</p>
    </div>
);

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

// --- Main AboutPage ---

function AboutPage() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [heroTransform, setHeroTransform] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);
            // Move hero section up quickly (multiply by 1.5 for faster movement)
            setHeroTransform(scrollY * 1.5);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const navigateHome = () => {
        navigate('/');
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
                <div className="logo" onClick={navigateHome}>SBD Energy</div>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/award" className="nav-link">Awards</a>
                    <a href="/contact" className="nav-link">Contact</a>
                </div>
            </nav>

            <div className="back-button" onClick={() => navigate('/')} title="Back"></div>
            
            <main className="content" >

                <section className="overview-section">
                    <div className="overview-container">
                        <div className="overview-content">
                            <p className="section-text reveal">
                                SBD Group, in existence since 2002, is a business with a diverse portfolio and reach across India, 
                                serving as the leading solution provider in Renewable Energy Solutions (Solar Power Plant, Mini Grid 
                                Solar Projects, Street Lighting, Water Heater), Surveillance Solutions, Smart City IT and ICCC Solutions, 
                                EV Charging Infra Solutions, Water Purification and Distribution Network and Vending Solutions, Civil and 
                                Road Infra, Optical Fibre Cable Laying, and Brand Creation and Promotion.
                            </p>
                            <div className="highlight-box reveal" style={{ transitionDelay: '0.1s' }}>
                                <p className="highlight-text">
                                    SBD is proud to be part of executing projects for the benefit of Environment, Improving the life of 
                                    the Poorest in the remotest locations, Innovative Solutions, and Reduction of Pollution.
                                </p>
                            </div>
                            <p className="section-text reveal" style={{ transitionDelay: '0.2s' }}>
                                The company became a pioneer in generation of green energy by executing major projects with State Governments, 
                                PSU's and State Nodal Agencies. SBD Green Energy has erected projects at <strong>500 locations across various 
                                states of India</strong>.
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
                        SBD is a Group to Create, Innovate, Research, Formulate, Integrate and Convert Ideas, which will pave 
                        the way of generations towards environment and Ease of Living Life. We are looking to contribute to the 
                        betterment of each human being in the universe with the use of advanced and innovative technology for:
                    </p>
                    <div className="pillars-grid">
                        {["Better Atmosphere", "Better Community Services", "Better Personalized Solutions"].map((title, index) => (
                            <PillarCard key={title} title={title} index={index} />
                        ))}
                    </div>
                </section>

                <section className="vision-highlight reveal">
                    <p className="vision-text">
                        "To be marked most reputed EV Charging Infra Solution Provider by 2030"
                    </p>
                </section>

                <section className="contributions-section">
                    <h2 className="section-title reveal">Business with Social Contributions</h2>
                    <div className="contributions-grid">
                        {contributionsData.map((contribution, index) => (
                            <ContributionCard key={index} {...contribution} index={index} />
                        ))}
                    </div>
                </section>

                <GallerySection title="Our Certifications" images={certificationImages} />

                <GallerySection title="Our Empanelments" images={empanelmentImages} />

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