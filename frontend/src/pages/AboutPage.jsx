import React from 'react';
import { useTheme } from '../context/SafeThemeContext';
import DynamicLogo from '../components/logos/DynamicLogo';

const AboutPage = () => {
  const { currentTheme } = useTheme();

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former VP of Operations at Fortune 500 financial services company. 15+ years experience in customer management systems.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Ex-Google engineer with expertise in scalable systems. Led development teams at multiple healthcare tech startups.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Product management veteran from logistics industry. Specialized in user experience and workflow optimization.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Full-stack architect with 12+ years building enterprise software. Expert in security and compliance systems.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      twitter: '#'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to simplify customer management across industries'
    },
    {
      year: '2021',
      title: 'First 1,000 Users',
      description: 'Reached our first major milestone with banking sector customers'
    },
    {
      year: '2022',
      title: 'Multi-Sector Launch',
      description: 'Expanded to healthcare, logistics, and content creation sectors'
    },
    {
      year: '2023',
      title: 'Enterprise Features',
      description: 'Launched advanced analytics, API access, and enterprise security'
    },
    {
      year: '2024',
      title: '10,000+ Customers',
      description: 'Serving businesses of all sizes across four major industries'
    },
    {
      year: '2025',
      title: 'Global Expansion',
      description: 'International presence with 24/7 support and localization'
    }
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust & Security',
      description: 'We prioritize the security and privacy of your data with enterprise-grade protection and compliance standards.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'Innovation',
      description: 'Continuously evolving our platform with cutting-edge technology to meet the changing needs of modern businesses.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Customer Success',
      description: 'Your success is our success. We provide dedicated support and resources to help you achieve your goals.'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Global Impact',
      description: 'Building solutions that make a positive impact on businesses and communities around the world.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.accent})` 
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="mb-8">
            <DynamicLogo size={80} showUnified={true} animated={true} />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About CMS Platform
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to revolutionize customer management across industries, 
            making powerful tools accessible to businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
                Our Mission
              </h2>
              <p className="text-lg text-base-content/80 leading-relaxed mb-6">
                To empower businesses across all sectors with intelligent, sector-specific customer management 
                solutions that drive growth, improve efficiency, and enhance customer relationships.
              </p>
              <p className="text-lg text-base-content/80 leading-relaxed">
                We believe that every business, regardless of size or industry, deserves access to 
                enterprise-grade tools that can scale with their ambitions and adapt to their unique needs.
              </p>
            </div>
            <div className="bg-base-200 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
                Our Vision
              </h3>
              <p className="text-base-content/80 leading-relaxed">
                To become the world's most trusted and comprehensive customer management platform, 
                enabling businesses to focus on what they do best while we handle the complexity 
                of customer relationship management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
              Our Values
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ 
                    backgroundColor: `${currentTheme.colors.primary}15`,
                    color: currentTheme.colors.primary 
                  }}
                >
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-base-content/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-base-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
              Our Journey
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              From startup to industry leader
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full rounded-full"
              style={{ backgroundColor: `${currentTheme.colors.primary}30` }}
            ></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-base-200 rounded-2xl p-6 shadow-lg">
                      <div 
                        className="text-2xl font-bold mb-2"
                        style={{ color: currentTheme.colors.primary }}
                      >
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-base-content/70">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div 
                    className="w-6 h-6 rounded-full border-4 border-base-100 z-10"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  ></div>
                  
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-base-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
              Meet Our Team
            </h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              The passionate people behind CMS Platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-base-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div 
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <div 
                  className="text-sm font-medium mb-3"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {member.role}
                </div>
                <p className="text-base-content/70 text-sm leading-relaxed mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href={member.linkedin} className="btn btn-ghost btn-sm btn-circle">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href={member.twitter} className="btn btn-ghost btn-sm btn-circle">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-base-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
            Ready to Join Our Journey?
          </h2>
          <p className="text-xl text-base-content/70 mb-8">
            Be part of the next chapter in customer management innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn btn-outline btn-lg"
              style={{ borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }}
            >
              View Careers
            </button>
            <button 
              className="btn btn-lg text-white"
              style={{ backgroundColor: currentTheme.colors.primary }}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
