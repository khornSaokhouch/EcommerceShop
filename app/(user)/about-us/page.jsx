// app/about-us/page.jsx
import React from 'react';
import AboutUsClient from '../../components/user/AboutUsClient';

export const metadata = {
  title: "About Us | Technocore Ecosystem",
  description: "Learn more about the Technocore platform and our mission to power the future of hardware commerce.",
};

export default function AboutUsPage() {
  return (
    <main className="bg-slate-50">
      <AboutUsClient />
    </main>
  );
}