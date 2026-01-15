import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';
import ThreeBackground from '../components/ThreeBackground';
import logo from './logo.png';

// --- Contact Data --- 

const contactInfo = {
    company: "SBD Green Energy and Infra India Pvt. Ltd.",
    address: {
        registered: "604, 604A, M3M Urbana, Sector-67, Gurugram, Haryana, India – 122001",
        branches: "Branch offices at Delhi, Madhya Pradesh, Jharkhand, Uttar Pradesh"
    },
    phones: [
        { label: "Office", numbers: ["0124-4108260", "+91-9599088510"] }
    ],
    emails: [
        { label: "Sales", email: "sales@sbdgreenenergy.com" },
        { label: "Projects", email: "projects@sbdgreenenergy.com" },
        { label: "General Info", email: "info@sbdgreenenergy.com" }
    ],
    website: "www.sbdgreenenergy.com",
    social: [
        { platform: "LinkedIn", icon: "💼", url: "#" },
        { platform: "Twitter", icon: "🐦", url: "#" },
        { platform: "Facebook", icon: "📘", url: "#" },
        { platform: "Instagram", icon: "📸", url: "#" }
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

// --- Contact Info Card Component ---
const ContactCard = ({ icon, title, items, index }) => (
    <div className="contact-card reveal" style={{ transitionDelay: `${index * 0.1}s` }}>
        <div className="contact-icon">{icon}</div>
        <h3 className="contact-card-title">{title}</h3>
        <div className="contact-card-content">
            {items.map((item, idx) => (
                <div key={idx} className="contact-item">
                    {item.label && <span className="contact-label">{item.label}:</span>}
                    <span className="contact-value">{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- Main Contact Page ---
function ContactPage() {
    const navigate = useNavigate();
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Force scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormStatus({ type: '', message: '' });

        try {
            // Replace 'YOUR_FORM_ID' with your actual Formspree form ID
            // Get one free at https://formspree.io/
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormStatus({
                    type: 'success',
                    message: 'Thank you for reaching out! Our team will get back to you within 24 hours.'
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    subject: '',
                    message: '',
                    inquiryType: 'general'
                });
            } else {
                setFormStatus({
                    type: 'error',
                    message: 'Oops! Something went wrong. Please try again or email us directly.'
                });
            }
        } catch (error) {
            setFormStatus({
                type: 'error',
                message: 'Failed to send message. Please check your connection and try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const navigateToAwards = () => {
        navigate('/awards');
    };

    const navigateToContact = () => {
        navigate('/contact');
    };

    const navigateToSocial = () => {
        navigate('/social');
    };

    const navigateToAPress = () => {
        navigate('/press');
    };


    // Prepare contact cards data
    const addressItems = [
        { label: "Registered Office", value: contactInfo.address.registered },
        { value: contactInfo.address.branches }
    ];

    const phoneItems = contactInfo.phones.flatMap(phone => 
        phone.numbers.map(number => ({ label: phone.label, value: number }))
    );

    const emailItems = contactInfo.emails.map(email => ({
        label: email.label,
        value: email.email
    }));

    return (
        <div className="ContactPage">
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
                <section className="hero-section">
                    <h1 className="hero-headline reveal-hero">Connect <span className="highlight">With Us</span></h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Let's Build a Sustainable Future Together
                    </p>
                </section>

                <section className="company-info reveal">
                    <h2 className="company-name">{contactInfo.company}</h2>
                    <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="company-website">
                        🌐 {contactInfo.website}
                    </a>
                </section>

                <section className="contact-cards-section">
                    <div className="contact-cards-grid">
                        <ContactCard 
                            icon="📞" 
                            title="Phone" 
                            items={phoneItems}
                            index={0}
                        />
                        <ContactCard 
                            icon="📍" 
                            title="Our Locations" 
                            items={addressItems}
                            index={1}
                        />
                        <ContactCard 
                            icon="✉️" 
                            title="Email" 
                            items={emailItems}
                            index={2}
                        />
                    </div>
                </section>

                <section className="social-section reveal">
                    <h3 className="social-title">Follow Us</h3>
                    <div className="social-links">
                        {contactInfo.social.map((social, index) => (
                            <a 
                                key={index}
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="social-link"
                                title={social.platform}
                            >
                                <span className="social-icon">{social.icon}</span>
                                <span className="social-name">{social.platform}</span>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="form-section">
                    <div className="form-container reveal">
                        <h2 className="section-title">Get in Touch</h2>
                        <p className="form-description">
                            Have a question or a project in mind? Fill out the form below and our team will reach out soon.
                        </p>

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="inquiryType">Inquiry Type *</label>
                                <select
                                    id="inquiryType"
                                    name="inquiryType"
                                    value={formData.inquiryType}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="partnership">Partnership Opportunity</option>
                                    <option value="project">Project Consultation</option>
                                    <option value="sales">Sales Inquiry</option>
                                    <option value="support">Technical Support</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+91-XXXXXXXXXX"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="company">Company/Organization</label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        placeholder="Your Company"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="How can we help you?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Tell us more about your project or inquiry..."
                                ></textarea>
                            </div>

                            {formStatus.message && (
                                <div className={`form-status ${formStatus.type}`}>
                                    {formStatus.message}
                                </div>
                            )}

                            <button type="submit" className="submit-button" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner"></span>
                                        Sending...
                                    </>
                                ) : (
                                    'Send Message'
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="partnership-section reveal">
                    <div className="partnership-container">
                        <h2 className="section-title">Partnership Opportunities</h2>
                        <p className="partnership-description">
                            We're always looking for innovative partners to collaborate on sustainable infrastructure projects. 
                            Whether you're a technology provider, government agency, or corporate entity, let's explore how we can 
                            work together to create impactful solutions.
                        </p>
                        <div className="partnership-benefits">
                            <div className="benefit-item">
                                <span className="benefit-icon">🤝</span>
                                <h4>Strategic Collaboration</h4>
                                {/* <p>Joint ventures and long-term partnerships</p> */}
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">💡</span>
                                <h4>Innovation</h4>
                                {/* <p>Co-develop cutting-edge solutions</p> */}
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">🌍</span>
                                <h4>Impact</h4>
                                {/* <p>Create sustainable change together</p> */}
                            </div>
                        </div>
                        <button className="partnership-button" onClick={() => {
                            setFormData(prev => ({ ...prev, inquiryType: 'partnership' }));
                            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Explore Partnerships
                        </button>
                    </div>
                </section>

                <section className="map-section reveal">
                    <h2 className="section-title">Find Us</h2>
                    <div className="map-container">
                        <iframe
                            title="SBD Energy Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.8676437729845!2d77.06682931508076!3d28.451824982488566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18be5e8c1d75%3A0x5a5e2e5e5e5e5e5e!2sM3M%20Urbana!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ContactPage;