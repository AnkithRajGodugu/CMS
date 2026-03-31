import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

/**
 * SectorSelectionPage allows users without an assigned sector to select one
 * Requirements: 1.4
 */
const SectorSelectionPage = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();
  const { detectSector } = useAuth();

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const response = await api.get('/public/sectors');
      setSectors(response.data);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError('Failed to load sectors');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setShowConfirmation(true);
  };

  const handleConfirmSelection = async () => {
    if (!selectedSector) {
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/select-sector', { sectorId: selectedSector.id });
      
      // Detect sector again to update context
      const detectedSector = await detectSector();
      
      if (detectedSector && detectedSector.routePath) {
        navigate(detectedSector.routePath);
      }
    } catch (err) {
      console.error('Error selecting sector:', err);
      setError('Failed to select sector. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelSelection = () => {
    setShowConfirmation(false);
    setSelectedSector(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            Select Your Sector
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the industry sector that best fits your business needs. 
            You can change this later in your settings.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-2xl mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Sector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden ${
                selectedSector?.id === sector.id ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => handleSectorClick(sector)}
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
                {selectedSector?.id === sector.id && (
                  <div className="flex items-center text-blue-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Selected
                  </div>
                )}
              </div>
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

      {/* Confirmation Modal */}
      {showConfirmation && selectedSector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Confirm Sector Selection
            </h3>
            <p className="text-gray-600 mb-6">
              You've selected <strong>{selectedSector.name}</strong>. 
              This will be your primary sector and you'll be redirected to the {selectedSector.name} dashboard.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelSelection}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Confirming...
                  </span>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorSelectionPage;
