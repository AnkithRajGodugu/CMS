import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/SectorThemeProvider';
import DynamicLogo from '../../components/logos/DynamicLogo';
import api from '../../services/api';

const RESEND_COOLDOWN = 60; // seconds

const ForgotPasswordPage = () => {
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const primaryColor = currentTheme?.primary || '#1e40af';

  // Countdown timer for resend button
  useEffect(() => {
    if (cooldown <= 0) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const sendResetEmail = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message || 'If that email is registered, a reset link has been sent.');
      setSubmitted(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'An unexpected error occurred. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendResetEmail();
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    await sendResetEmail();
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

          {/* ── Success State ── */}
          {submitted ? (
            <div className="text-center space-y-6">
              {/* Animated checkmark */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <svg className="w-8 h-8" fill="none" stroke={primaryColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-base-content mb-2">Check your inbox</h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  If <span className="font-medium text-base-content">{email}</span> is registered,
                  a password reset link has been sent. Check your spam folder if you don't see it.
                </p>
              </div>

              {/* Resend with countdown */}
              <div className="space-y-3">
                {cooldown > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-base-content/60">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resend available in {cooldown}s
                  </div>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full py-2.5 px-4 border rounded-md text-sm font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      backgroundColor: `${primaryColor}10`,
                    }}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      'Resend Email'
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setError('');
                    setCooldown(0);
                  }}
                  className="w-full py-2 px-4 text-sm text-base-content/60 hover:text-base-content transition-colors"
                >
                  Use a different email
                </button>
              </div>

              {error && (
                <div className="bg-error/10 border-l-4 border-error p-3 rounded-md text-sm text-error text-left">
                  {error}
                </div>
              )}
            </div>
          ) : (
            /* ── Default Form State ── */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {message && (
                <div className="bg-success/10 border-l-4 border-success p-4 rounded-md">
                  <p className="text-sm text-success">{message}</p>
                </div>
              )}
              {error && (
                <div className="bg-error/10 border-l-4 border-error p-4 rounded-md">
                  <p className="text-sm text-error">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-base-content mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
                  style={{ '--tw-ring-color': primaryColor }}
                  placeholder="you@example.com"
                />
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
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    'Send reset link'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ── Footer Link ── */}
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
