// components/user/FAQContent.jsx
"use client";

import { useState, useMemo } from "react";
import { FaChevronDown, FaInfoCircle, FaRocket, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link'; // Added Link for the Contact CTA

// --- Updated and Categorized FAQ Data ---
const allFaqs = [
    // General Information
    {
        category: "General",
        question: "What is E-Commerces?",
        answer: "E-Commerces is a modern platform designed to help businesses of all sizes manage their online stores with ease, security, and scalability.",
        icon: FaInfoCircle
    },
    {
        category: "General",
        question: "Can small businesses use E-Commerces?",
        answer: "Absolutely! Our platform is built to support everyone from small startups to large enterprises. We offer tiered plans to match your growth.",
        icon: FaInfoCircle
    },
    {
        category: "General",
        question: "Is there a free trial?",
        answer: "Yes! We offer a free trial period so you can explore all features before committing to a plan. No credit card is required to start.",
        icon: FaInfoCircle
    },
    // Platform Features
    {
        category: "Platform Features",
        question: "Can I customize my storefront?",
        answer: "Absolutely! You can fully customize your store’s look and feel to match your brand using our intuitive theme editor and custom code access.",
        icon: FaRocket
    },
    {
        category: "Platform Features",
        question: "Can I integrate third-party tools?",
        answer: "Yes, our platform supports seamless integrations with popular tools like payment gateways, CRMs (e.g., Salesforce), and major shipping solutions (e.g., FedEx, DHL).",
        icon: FaRocket
    },
    {
        category: "Platform Features",
        question: "How do I track my sales?",
        answer: "Our built-in analytics dashboard provides real-time data, helping you track orders, revenue, conversion rates, and customer behavior easily.",
        icon: FaRocket
    },
    {
        category: "Platform Features",
        question: "Is the platform mobile-friendly?",
        answer: "Yes, both the store management dashboard (for merchants) and the customer shopping experience are fully responsive and optimized for all mobile devices.",
        icon: FaRocket
    },
    // Security & Support
    {
        category: "Security & Support",
        question: "How secure is the platform?",
        answer: "We use industry-standard SSL/TLS encryption, robust firewalls, and regular security audits to ensure all transactions and customer data are safe and compliant with global standards.",
        icon: FaShieldAlt
    },
    {
        category: "Security & Support",
        question: "Do you offer customer support?",
        answer: "Yes, we provide 24/7 customer support via live chat, email, and phone to help you with technical issues, store setup, and scaling your business.",
        icon: FaShieldAlt
    },
    {
        category: "Security & Support",
        question: "Do you provide training?",
        answer: "We offer comprehensive tutorials, video guides, and personalized onboarding sessions to ensure you get the most out of the platform quickly.",
        icon: FaShieldAlt
    },
];

// Helper to map category names to icons for the filter menu
const categoryIcons = {
    "General": FaInfoCircle,
    "Platform Features": FaRocket,
    "Security & Support": FaShieldAlt
};

export default function FAQContent() {
    const [openIndex, setOpenIndex] = useState(null);
    const [activeCategory, setActiveCategory] = useState("All");

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Filter FAQs based on the active category
    const filteredFaqs = useMemo(() => {
        if (activeCategory === "All") {
            return allFaqs;
        }
        return allFaqs.filter(faq => faq.category === activeCategory);
    }, [activeCategory]);
    
    // Get unique categories for the filter menu
    const categories = useMemo(() => {
        const unique = ["All", ...new Set(allFaqs.map(faq => faq.category))];
        return unique;
    }, []);


    return (
        <section className="max-w-6xl mx-auto">
            
            <header className="text-center mb-16">
                <p className="text-lg font-semibold text-indigo-600 mb-2">GOT QUESTIONS?</p>
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    Frequently Asked Questions
                </h1>
            </header>

            {/* Content Grid: Filter on Left, FAQs on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                
                {/* Left Column: Category Filter */}
                <aside className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100 sticky top-20">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">
                            Explore by Topic
                        </h3>
                        <nav className="space-y-2">
                            {categories.map((category) => {
                                const Icon = categoryIcons[category];
                                const isActive = activeCategory === category;
                                
                                return (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setActiveCategory(category);
                                            setOpenIndex(null); // Close any open FAQ when switching categories
                                        }}
                                        className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition duration-200 ${
                                            isActive
                                                ? "bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        }`}
                                    >
                                        {category !== "All" && Icon && <Icon size={18} />}
                                        <span className="text-md">{category} ({category === "All" ? allFaqs.length : allFaqs.filter(f => f.category === category).length})</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Right Column: Accordion Content */}
                <div className="lg:col-span-3 space-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-lg transition duration-300 ${openIndex === index ? "border-2 border-indigo-500 shadow-2xl" : "border border-gray-200"}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className={`w-full flex justify-between items-center p-5 text-left text-lg font-semibold rounded-xl transition duration-300 ${openIndex === index ? "text-indigo-700 bg-indigo-50" : "text-gray-800 hover:bg-gray-50"}`}
                                >
                                    {faq.question}
                                    <FaChevronDown 
                                        size={16}
                                        className={`ml-2 transform transition-transform duration-300 ${openIndex === index ? "rotate-180 text-indigo-600" : "text-gray-500"}`}
                                    />
                                </button>
                                {openIndex === index && (
                                    <div className="px-5 pb-5 pt-0">
                                        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-700 border-l-4 border-indigo-300">
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
                            <p className="text-xl text-gray-600">No FAQs found for the '{activeCategory}' category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom CTA for Unanswered Questions */}
            <div className="text-center mt-20 p-8 bg-indigo-50 rounded-xl shadow-lg border-t-4 border-gray-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Still Have Questions?
                </h3>
                <p className="text-gray-700 mb-4">
                    If you couldn't find your answer here, our friendly support team is ready to assist you 24/7.
                </p>
                <Link
                    href="/contact-us"
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition transform hover:translate-y-0.5"
                >
                    Contact Support
                </Link>
            </div>
        </section>
    );
}