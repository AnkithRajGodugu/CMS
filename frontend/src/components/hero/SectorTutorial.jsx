import React from 'react';
import { Link } from 'react-router-dom';
import TutorialVideo from './TutorialVideo';
import FeatureList from './FeatureList';
import UseCaseExamples from './UseCaseExamples';

const SectorTutorial = ({ sector, onClose }) => {
  if (!sector) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{sector.name}</h2>
              <p className="text-blue-100">{sector.description}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
              aria-label="Close tutorial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Tutorial Video */}
          <TutorialVideo sectorCode={sector.code} />

          {/* Features */}
          <FeatureList sector={sector} />

          {/* Use Cases */}
          <UseCaseExamples sector={sector} />

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Ready to Get Started with {sector.name}?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of organizations already using our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Start Free Trial
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to={`/login?sector=${sector.code.toLowerCase()}`}
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorTutorial;
