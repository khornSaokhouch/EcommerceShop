// app/about-us/page.jsx
import React from 'react';
import AboutUsClient from '../../components/user/AboutUsClient';

export const metadata = {
  title: "About Us | E-Commerces",
  description: "Learn more about our e-commerce platform and our mission.",
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}