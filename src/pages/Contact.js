import React, { useEffect, useState } from 'react';
import './Contact.css';
import ThreeBackground from '../components/ThreeBackground';

// --- Contact Data ---

const contactInfo = {
    company: "SBD GREEN ENERGY AND INFRA INDIA PVT LIMITED",
    address: {
        registered: "604, 604A, M3M Urbana, Sector-67, Gurugram, Haryana, India - 122001",
        branches: "Branch offices at Delhi, Madhya Pradesh, Jharkhand, Uttar Pradesh"
    },
    phones: [
        { label: "Office", numbers: ["0124 258 3349", "0124 410 8260", "+91-9599088510"] },
        { label: "Sales", numbers: ["+91-9599088509", "+91-9599088511"] },
        { label: "O & M", numbers: ["+91-9599088504"] },
        { label: "Projects", numbers: ["+91-9599088505"] }
    ],
    emails: [
        { label: "Sales", email: "sales@sbdgreenenergy.com" },
        { label: "Projects", email: "projects@sbdgreenenergy.com" },
        { label: "General Info", email: "info@sbdgreenenergy.com" }
    ],
    website: "www.sbdgreenenergy.com"
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
    useScrollReveal();
    const [scrolled, setScrolled] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                    message: 'Thank you for your message! We will get back to you soon.'
                });
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    subject: '',
                    message: ''
                });
            } else {
                setFormStatus({
                    type: 'error',
                    message: 'Oops! Something went wrong. Please try again.'
                });
            }
        } catch (error) {
            setFormStatus({
                type: 'error',
                message: 'Failed to send message. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const navigateHome = () => {
        window.location.href = '/';
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div className="logo" onClick={navigateHome}>SBD Energy</div>
                <div className="nav-links">
                    <a href="/" className="nav-link">Home</a>
                    <a href="/about" className="nav-link">About</a>
                    <a href="/awards" className="nav-link">Awards</a>
                </div>
            </nav>
 
            <div className="back-button" onClick={() => window.history.back()}title="Back"
></div>

            <main className="content">
                <section className="hero-section">
                    <h1 className="hero-headline reveal-hero">Get in <span className="highlight">Touch</span></h1>
                    <p className="hero-subheadline reveal-hero" style={{ transitionDelay: '0.2s' }}>
                        Let's build a sustainable future together
                    </p>
                </section>

                <section className="company-info reveal">
                    <h2 className="company-name">{contactInfo.company}</h2>
                    <a href={`https://${contactInfo.website}`} target="_blank" rel="noopener noreferrer" className="company-website">
                        {contactInfo.website}
                    </a>
                </section>

                 <section className="contact-cards-section">
                    <div className="contact-cards-grid">
                        
                        <ContactCard 
                            icon="📞" 
                            title="Phone Numbers" 
                            items={phoneItems}
                            index={0}
                        />
                        <div className="contact-cards-column">
                            <ContactCard 
                            icon="📍" 
                            title="Our Locations" 
                            items={addressItems}
                            index={1}
                        />
                            <ContactCard 
                                icon="✉️" 
                                title="Email Addresses" 
                                items={emailItems}
                                index={2}
                            />
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <div className="form-container reveal">
                        <h2 className="section-title">Send us a Message</h2>
                        <p className="form-description">
                            Have a question or want to discuss a project? Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        <form onSubmit={handleSubmit} className="contact-form">
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