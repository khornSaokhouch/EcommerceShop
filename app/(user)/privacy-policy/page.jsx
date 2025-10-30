// app/privacy-policy/page.jsx

// You may need to change this to a client component if you want the TOC to highlight active sections on scroll.
// "use client"; 

import Link from 'next/link';

export const metadata = {
    title: "Privacy Policy | E-Commerces",
    description: "Read the Privacy Policy for how we handle and protect your data.",
};

const policySections = [
    { id: "info-collection", title: "1. Information We Collect" },
    { id: "info-use", title: "2. How We Use Your Information" },
    { id: "info-sharing", title: "3. Sharing of Information" },
    { id: "data-security", title: "4. Data Security" },
    { id: "cookies", title: "5. Cookies and Tracking" },
    { id: "your-rights", title: "6. Your Rights" },
    { id: "policy-changes", title: "7. Changes to This Policy" },
    { id: "contact", title: "8. Contact Us" },
];

const PolicyText = ({ children }) => (
    <p className="text-gray-700 leading-loose text-lg">{children}</p>
);

const PolicyHeading = ({ id, children }) => (
    <h2 id={id} className="text-3xl font-bold text-gray-900 mb-4 pt-4 border-t border-gray-200 mt-8">
        {children}
    </h2>
);

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-16">
            <section className="max-w-6xl mx-auto px-6 md:px-12">
                
                {/* Header Section */}
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-indigo-700 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Your trust is our priority. We are committed to safeguarding your data.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        **Last Updated:** October 3, 2025
                    </p>
                </header>

                {/* Content Grid: TOC on Left, Policy Text on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    
                    {/* Left Column: Sticky Table of Contents (TOC) */}
                    <aside className="lg:col-span-1 hidden lg:block">
                        <div className="sticky top-20 p-6 bg-white rounded-xl shadow-lg border-l-4 border-indigo-600">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Quick Navigation
                            </h3>
                            <nav className="space-y-3">
                                {policySections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="block text-gray-600 hover:text-indigo-600 transition duration-150 text-sm font-medium border-l-2 border-transparent pl-3 hover:border-indigo-600"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Right Column: Policy Content */}
                    <article className="lg:col-span-3 bg-white p-8 md:p-10 rounded-xl shadow-2xl">
                        
                        <PolicyText>
                            At <span className="font-extrabold text-indigo-700">E-Commerces</span>, we respect your
                            privacy and are committed to protecting your personal information.
                            This Privacy Policy explains how we collect, use, and safeguard your
                            data when you use our platform.
                        </PolicyText>

                        <div className="space-y-6">
                            
                            <section>
                                <PolicyHeading id="info-collection">1. Information We Collect</PolicyHeading>
                                <PolicyText>
                                    We may collect **personal identification information** such as your name, email
                                    address, and physical address when you register. We also collect **financial data** (payment details) and **usage data** (IP address, browser type, pages visited) when 
                                    you make purchases or interact with our services.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="info-use">2. How We Use Your Information</PolicyHeading>
                                <PolicyText>
                                    Your information is primarily used to **provide and improve our services** (e.g., website functionality),
                                    **process payments and orders**, deliver critical security alerts, and **personalize your experience** on our platform. 
                                    We analyze usage data to understand user behavior and enhance our offerings.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="info-sharing">3. Sharing of Information</PolicyHeading>
                                <PolicyText>
                                    We operate on a strict **no-sale policy** regarding your personal data. We only share limited 
                                    information with **trusted third-party partners** (such as payment processors, shipping providers, 
                                    and essential analytics tools) strictly when necessary to fulfill our core business services and legal obligations. 
                                    These partners are bound by confidentiality agreements.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="data-security">4. Data Security</PolicyHeading>
                                <PolicyText>
                                    We prioritize the security of your data using **state-of-the-art encryption (SSL/TLS)**, multi-factor 
                                    authentication, and regular security audits. While we implement strong measures to protect your data from
                                    unauthorized access, disclosure, or misuse, please remember that no method of online transmission 
                                    is 100% secure. We encourage you to use strong, unique passwords.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="cookies">5. Cookies and Tracking</PolicyHeading>
                                <PolicyText>
                                    Our platform uses **cookies and similar tracking technologies** to enhance your
                                    experience, maintain your session, analyze website traffic, and improve functionality. 
                                    By using our service, you consent to our use of cookies. You may 
                                    choose to **disable cookies** in your browser settings, though this may impact some functionality.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="your-rights">6. Your Rights</PolicyHeading>
                                <PolicyText>
                                    You maintain fundamental rights over your data, including the right to **access, correct, or delete** your personal data held by E-Commerces. To make a data request or exercise any of these rights, 
                                    please contact us directly using the details provided in Section 8.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="policy-changes">7. Changes to This Policy</PolicyHeading>
                                <PolicyText>
                                    We reserve the right to **update this Privacy Policy periodically** to reflect changes in our practices 
                                    or legal requirements. Any significant changes will be notified by updating the "Last Updated" date 
                                    at the top of this page. Your continued use of our platform after any changes constitutes acceptance of the updated policy.
                                </PolicyText>
                            </section>

                            <section>
                                <PolicyHeading id="contact">8. Contact Us</PolicyHeading>
                                <PolicyText>
                                    If you have any questions or concerns about this Privacy Policy or our data handling practices, please
                                    contact our Data Protection Officer directly at:
                                    <br />
                                    <Link
                                        href="mailto:support@e-commerces.com"
                                        className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition mt-2 inline-block"
                                    >
                                        support@e-commerces.com
                                    </Link>
                                </PolicyText>
                            </section>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    );
}