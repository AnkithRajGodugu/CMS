import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SafeThemeContext';
import DynamicLogo from '../../components/logos/DynamicLogo';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const primaryColor = currentTheme?.primary || '#1e40af';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'If that email is registered, a reset link has been sent.');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <DynamicLogo size={48} animated={true} />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-base-content tracking-tight">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-base-content/70">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-base-100 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-base-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {message && (
              <div className="bg-success/10 border-l-4 border-success p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-success">{message}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-error/10 border-l-4 border-error p-4 rounded-md animate-shake">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-error">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
                  style={{
                    '--tw-ring-color': primaryColor,
                  }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                style={{
                  backgroundColor: primaryColor,
                  '--tw-ring-color': primaryColor,
                }}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-100 text-base-content/60">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/login"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: primaryColor }}
              >
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
