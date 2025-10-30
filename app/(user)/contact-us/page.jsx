// app/contact-us/page.jsx
import React from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import ContactForm from '../../components/user/ContactForm'; // Ensure this path is correct

export const metadata = {
  title: "Contact Us | E-Commerces",
  description: "Get in touch with the E-Commerces team for support or inquiries.",
};

// Helper component for contact details (remains the same)
const ContactInfoItem = ({ icon: Icon, title, content, isLink = false, href = "#" }) => (
    <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-indigo-50 transition duration-200">
        <Icon className="text-indigo-600 flex-shrink-0" size={24} />
        <div>
            <h3 className="text-base font-semibold text-gray-800">{title}</h3>
            {isLink ? (
                <a 
                    href={href} 
                    className="text-gray-700 hover:text-indigo-700 font-medium transition"
                    aria-label={`Contact via ${title}`}
                >
                    {content}
                </a>
            ) : (
                <p className="text-gray-700 font-medium">{content}</p>
            )}
        </div>
    </div>
);

export default function ContactUsPage() {
  return (
    <main className="min-h-screen ">
      
      {/* 1. Hero Section - Prominent Header */}
      <section className="bg-indigo-700 py-20 mb-12">
        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Let's Talk Business 🚀
          </h1>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
            We're eager to hear about your e-commerce needs. Reach out for support, partnerships, or just to say hello!
          </p>
        </div>
      </section>

      {/* 2. Primary Contact Section (Form and Details side-by-side) */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Details */}
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-8 h-full"> 
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
              Direct Contact Information
            </h2>

            {/* Information Grid */}
            <div className="space-y-2">
                <ContactInfoItem
                    icon={FaEnvelope}
                    title="Email Support"
                    content="support@e-commerces.com"
                    isLink={true}
                    href="mailto:support@e-commerces.com"
                />
                <ContactInfoItem
                    icon={FaPhone}
                    title="24/7 Phone Line"
                    content="+855 (0)23 123 456"
                    isLink={true}
                    href="tel:+85523123456"
                />
                <ContactInfoItem
                    icon={FaClock}
                    title="Response Time"
                    content="Mon - Fri, 9:00 AM – 6:00 PM (Local Time)"
                />
                <ContactInfoItem
                    icon={FaMapMarkerAlt}
                    title="Our Headquarters"
                    content="Royal University of Phnom Penh, Russian Blvd, Toul Kork, Phnom Penh, Cambodia"
                />
            </div>
          </div>

          {/* Right Column - Contact Form (Send us a Message) */}
          <div className="w-full">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* 3. Map Section (Find Us Here) - Full Width */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Find Us Here 📍
            </h2>
            <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-gray-100">
                <iframe
                    // Placeholder map source
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7750837894935!2d104.88724121478148!3d11.564756591784672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310931e2474149e9%3A0xc6a81b228f411894!2sRoyal%20University%20of%20Phnom%20Penh!5e0!3m2!1sen!2skh!4v1638848010834!5m2!1sen!2skh" 
                    width="100%"
                    height="450" // Increased height for better view
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Office Location Map"
                ></iframe>
            </div>
        </div>
      </section>
    </main>
  );
}