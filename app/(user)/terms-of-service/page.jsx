// app/terms-of-service/page.jsx
import Link from 'next/link';

export const metadata = {
    title: "Terms of Service | E-Commerces",
    description: "Read the Terms of Service for using E-Commerces platform.",
};

// Helper components to maintain clean structure and apply consistent styling
const TermsHeading = ({ number, children }) => (
    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-10 mb-4 flex items-baseline">
        <span className="text-indigo-600 mr-3 text-3xl font-mono">{number}.</span>
        {children}
    </h2>
);

const TermsParagraph = ({ children }) => (
    <p className="text-gray-700 leading-loose text-lg pl-6 border-l-2 border-indigo-100">{children}</p>
);

export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-gray-50 py-16">
            <section className="max-w-4xl mx-auto px-6 md:px-10">
                
                {/* Header Section */}
                <header className="mb-12 border-b-4 border-indigo-600 pb-4">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600">
                        Welcome to <span className="font-semibold text-indigo-700">E-Commerces</span>. 
                        These terms constitute a legally binding agreement between you and us.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Effective Date: October 3, 2025
                    </p>
                </header>

                {/* Key Definitions / Summary Box */}
                <div className="bg-indigo-50 p-6 md:p-8 rounded-xl shadow-inner mb-12 border-l-4 border-indigo-700">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-3">
                        Key Commitments
                    </h2>
                    <ul className="list-disc list-outside space-y-2 text-indigo-800 ml-5">
                        <li>**Acceptance:** By using our platform, you accept these Terms in full.</li>
                        <li>**Responsibility:** You are responsible for your account and all activities on it.</li>
                        <li>**Liability:** Our liability is expressly limited as described in Section 5.</li>
                        <li>**Disputes:** Disputes may be subject to arbitration or jurisdiction in our local courts.</li>
                    </ul>
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    
                    <section>
                        <TermsHeading number="1">Acceptance of Terms</TermsHeading>
                        <TermsParagraph>
                            By accessing or using **E-Commerces**, you agree to be bound by these
                            Terms of Service, our Privacy Policy, and all applicable laws and regulations. If you
                            do not agree to these legally binding conditions, you must discontinue use of our platform immediately.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="2">Use of the Platform</TermsHeading>
                        <TermsParagraph>
                            You agree to use the platform only for **lawful purposes** and in strict accordance with these Terms. 
                            Specifically, you must not use the platform to transmit any material that is harassing, libelous, 
                            abusive, threatening, harmful, vulgar, obscene, or otherwise objectionable. 
                            Any misuse, unauthorized access, or illegal activity may result in the immediate **suspension or termination** of your account.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="3">Accounts and Security</TermsHeading>
                        <TermsParagraph>
                            You are solely responsible for maintaining the **confidentiality of your account credentials** (including passwords) 
                            and for all activities that occur under your account. We are not liable for any loss or damage 
                            arising from your failure to comply with this security obligation. You must **notify us immediately** of any unauthorized use or security breach.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="4">Payments and Subscriptions</TermsHeading>
                        <TermsParagraph>
                            All payments made on the platform for goods or services are subject to our billing policies. 
                            Subscription fees, if applicable, are **non-refundable** unless otherwise stated in our separate refund policy. 
                            You authorize us (or our third-party payment processor) to charge your payment method for all applicable fees and taxes.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="5">Limitation of Liability</TermsHeading>
                        <TermsParagraph>
                            **E-Commerces is not liable** for any indirect, incidental, special, punitive, or
                            consequential damages arising from your use of the platform. In any event, our
                            **total aggregate liability** to you is expressly limited to the amount you paid us in fees in the last 12 months preceding the claim.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="6">Intellectual Property</TermsHeading>
                        <TermsParagraph>
                            All content, trademarks, service marks, and logos on the platform are the exclusive property of 
                            E-Commerces or its licensors and are protected by intellectual property laws. You may not 
                            reproduce, distribute, modify, or create derivative works of any content without our express written permission.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="7">Modifications to Terms</TermsHeading>
                        <TermsParagraph>
                            We reserve the right to **update or change these Terms of Service** at any time. We will provide 
                            reasonable notice of material changes, usually via email or a prominent notification on the platform. 
                            **Continued use** of the platform after changes are posted constitutes your acceptance of the new terms.
                        </TermsParagraph>
                    </section>

                    <section>
                        <TermsHeading number="8">Contact Information</TermsHeading>
                        <TermsParagraph>
                            If you have any questions or concerns regarding these Terms of Service, please contact our Legal Department:
                            <br />
                            <Link
                                href="mailto:support@e-commerces.com"
                                className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition mt-2 inline-block"
                            >
                                support@e-commerces.com
                            </Link>
                        </TermsParagraph>
                    </section>
                </div>
            </section>
        </main>
    );
}