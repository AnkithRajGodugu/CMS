import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/SafeThemeContext';

const TestimonialsSection = () => {
  const { currentTheme } = useTheme();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Operations Manager',
      company: 'First National Bank',
      sector: 'banking',
      image: '/api/placeholder/64/64',
      content: 'The banking module has transformed how we manage customer relationships. The compliance tools alone have saved us countless hours of manual work.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Chief Medical Officer',
      company: 'City General Hospital',
      sector: 'healthcare',
      image: '/api/placeholder/64/64',
      content: 'Patient management has never been easier. The HIPAA-compliant system gives us peace of mind while improving our workflow efficiency.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Supply Chain Director',
      company: 'Global Logistics Inc',
      sector: 'logistics',
      image: '/api/placeholder/64/64',
      content: 'Real-time tracking and inventory management features have reduced our operational costs by 30%. Absolutely game-changing for our business.',
      rating: 5
    },
    {
      name: 'James Wilson',
      role: 'Creative Director',
      company: 'Pixel Perfect Agency',
      sector: 'content',
      image: '/api/placeholder/64/64',
      content: 'The content creation tools and client portal have streamlined our entire project workflow. Our clients love the transparency and collaboration features.',
      rating: 5
    },
    {
      name: 'Amanda Foster',
      role: 'CEO',
      company: 'TechStart Solutions',
      sector: 'banking',
      image: '/api/placeholder/64/64',
      content: 'As a fintech startup, we needed a robust CMS that could scale with us. This platform exceeded our expectations in every way.',
      rating: 5
    },
    {
      name: 'Dr. Robert Kim',
      role: 'Practice Administrator',
      company: 'Family Health Clinic',
      sector: 'healthcare',
      image: '/api/placeholder/64/64',
      content: 'The appointment scheduling and patient records system has improved our patient satisfaction scores significantly. Highly recommended!',
      rating: 5
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getSectorColor = (sector) => {
    const colors = {
      banking: '#1e40af',
      healthcare: '#059669',
      logistics: '#ea580c',
      content: '#7c3aed'
    };
    return colors[sector] || currentTheme.colors.primary;
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
            Trusted by
            <span className="gradient-text"> Industry Leaders</span>
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have transformed their business operations with our platform.
          </p>
        </div>

        {/* Main testimonial */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-base-200 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            {/* Background pattern */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-5"
              style={{ 
                background: `radial-gradient(circle, ${getSectorColor(testimonials[currentTestimonial].sector)} 2px, transparent 2px)`,
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10">
              {/* Quote icon */}
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${getSectorColor(testimonials[currentTestimonial].sector)}15` }}
                >
                  <svg 
                    className="w-8 h-8" 
                    style={{ color: getSectorColor(testimonials[currentTestimonial].sector) }}
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <blockquote className="text-xl md:text-2xl text-center mb-8 leading-relaxed font-medium">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                {renderStars(testimonials[currentTestimonial].rating)}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: getSectorColor(testimonials[currentTestimonial].sector) }}
                >
                  {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-base-content/70">
                    {testimonials[currentTestimonial].role}
                  </div>
                  <div 
                    className="text-sm font-medium"
                    style={{ color: getSectorColor(testimonials[currentTestimonial].sector) }}
                  >
                    {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'w-8' : ''
                }`}
                style={{ 
                  backgroundColor: index === currentTestimonial 
                    ? currentTheme.colors.primary 
                    : `${currentTheme.colors.primary}30`
                }}
              />
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              10,000+
            </div>
            <div className="text-base-content/70">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              99.9%
            </div>
            <div className="text-base-content/70">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              4.9/5
            </div>
            <div className="text-base-content/70">Customer Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: currentTheme.colors.primary }}>
              24/7
            </div>
            <div className="text-base-content/70">Support</div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-base-200 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
              Ready to join our satisfied customers?
            </h3>
            <p className="text-base-content/70 mb-6">
              Start your free trial today and see why thousands of businesses trust our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="btn btn-outline"
                style={{ borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }}
              >
                Read More Reviews
              </button>
              <button 
                className="btn text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;