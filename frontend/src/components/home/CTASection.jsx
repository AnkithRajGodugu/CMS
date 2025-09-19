import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 gradient-bg">
      <div className="max-w-4xl mx-auto px-4 text-center text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Customer Management?
          </span>
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of businesses already using our platform to streamline their operations.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Start Free Trial
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link to="/contact" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
            Contact Sales
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-80">
          <div className="text-center">
            <div className="text-3xl font-bold">30-Day</div>
            <div className="text-sm">Free Trial</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">No</div>
            <div className="text-sm">Setup Fees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">Cancel</div>
            <div className="text-sm">Anytime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;