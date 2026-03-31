import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SectorThemeProvider';

const PricingSection = () => {
  const { currentTheme } = useTheme();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses and startups',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 1,000 customers',
        'Basic reporting',
        'Email support',
        '5GB storage',
        'Single sector access',
        'Mobile app access'
      ],
      popular: false,
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Up to 10,000 customers',
        'Advanced analytics',
        'Priority support',
        '50GB storage',
        'All sectors included',
        'API access',
        'Custom workflows',
        'Team collaboration'
      ],
      popular: true,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited customers',
        'Custom reporting',
        '24/7 phone support',
        'Unlimited storage',
        'All sectors + custom',
        'Advanced API access',
        'Custom integrations',
        'Dedicated account manager',
        'SLA guarantee',
        'White-label options'
      ],
      popular: false,
      cta: 'Contact Sales'
    }
  ];

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
  };

  return (
    <section className="py-20 bg-base-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: currentTheme.colors.text }}>
            Simple, Transparent
            <span className="gradient-text"> Pricing</span>
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
            Choose the perfect plan for your business. All plans include a 14-day free trial with no credit card required.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-base-content/60'}`}>
              Monthly
            </span>
            <div className="form-control">
              <label className="cursor-pointer label">
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={billingCycle === 'yearly'}
                  onChange={(e) => setBillingCycle(e.target.checked ? 'yearly' : 'monthly')}
                />
              </label>
            </div>
            <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-base-content/60'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span 
                className="badge badge-sm text-white font-semibold"
                style={{ backgroundColor: currentTheme.colors.accent }}
              >
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                plan.popular ? 'ring-2 ring-offset-2 ring-offset-base-200' : ''
              }`}
              style={{ 
                ringColor: plan.popular ? currentTheme.colors.primary : 'transparent'
              }}
            >
              {plan.popular && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  Most Popular
                </div>
              )}

              <div className="card-body p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>
                    {plan.name}
                  </h3>
                  <p className="text-base-content/70 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold" style={{ color: currentTheme.colors.primary }}>
                      ${getPrice(plan)}
                    </span>
                    <span className="text-base-content/60">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-base-content/60 mt-1">
                      Save {getSavings(plan)}% annually
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <svg 
                        className="w-5 h-5 flex-shrink-0" 
                        style={{ color: currentTheme.colors.primary }}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="card-actions justify-center">
                  {plan.cta === 'Contact Sales' ? (
                    <Link 
                      to="/contact" 
                      className="btn btn-outline btn-block"
                      style={{ borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <Link 
                      to="/signup" 
                      className={`btn btn-block text-white ${plan.popular ? '' : 'btn-outline'}`}
                      style={{ 
                        backgroundColor: plan.popular ? currentTheme.colors.primary : 'transparent',
                        borderColor: currentTheme.colors.primary,
                        color: plan.popular ? 'white' : currentTheme.colors.primary
                      }}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="text-center mt-16">
          <div className="bg-base-100 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4" style={{ color: currentTheme.colors.primary }}>
              Need a custom solution?
            </h3>
            <p className="text-base-content/70 mb-6">
              We offer custom enterprise solutions with tailored features, dedicated support, 
              and flexible pricing for large organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="btn btn-outline"
                style={{ borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary }}
              >
                Contact Sales
              </Link>
              <Link 
                to="/demo" 
                className="btn text-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Schedule Demo
              </Link>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-sm text-base-content/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;