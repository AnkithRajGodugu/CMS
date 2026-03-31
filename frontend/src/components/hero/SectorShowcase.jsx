import React from 'react';
import { Link } from 'react-router-dom';

const SectorShowcase = ({ sectors, loading, onSelectSector }) => {
  const getSectorIcon = (code) => {
    const icons = {
      'BANKING': '🏦',
      'HEALTHCARE': '🏥',
      'EDUCATION': '🎓',
      'RETAIL': '🛍️',
      'MANUFACTURING': '🏭',
      'LOGISTICS': '🚚',
      'CONTENT': '📝'
    };
    return icons[code] || '📊';
  };

  const getSectorColor = (code) => {
    const colors = {
      'BANKING': 'from-blue-500 to-blue-700',
      'HEALTHCARE': 'from-emerald-500 to-emerald-700',
      'EDUCATION': 'from-violet-500 to-violet-700',
      'RETAIL': 'from-red-500 to-red-700',
      'MANUFACTURING': 'from-slate-500 to-slate-700',
      'LOGISTICS': 'from-orange-500 to-orange-700',
      'CONTENT': 'from-pink-500 to-purple-700'
    };
    return colors[code] || 'from-gray-500 to-gray-700';
  };

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading sectors...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
            Explore Our Sectors
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the sector that fits your business needs. Each sector comes with specialized 
            tools, workflows, and features designed for your industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
              onClick={() => onSelectSector(sector)}
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${getSectorColor(sector.code)} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
                <div className="text-6xl relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {sector.icon || getSectorIcon(sector.code)}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                  {sector.name}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {sector.description || 'Specialized solutions for your industry needs'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSector(sector);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Learn More
                  </button>
                  <Link
                    to={`/login?sector=${sector.code.toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
                  >
                    Try Demo
                  </Link>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sectors.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No sectors available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SectorShowcase;
