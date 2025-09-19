import React from 'react';
import HeroSection from '../components/home/HeroSection';
import SectorsSection from '../components/home/SectorsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import PricingSection from '../components/home/PricingSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import CTASection from '../components/home/CTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <SectorsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
    </div>
  );
};

export default LandingPage;