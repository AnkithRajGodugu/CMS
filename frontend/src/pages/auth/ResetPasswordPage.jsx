import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/SectorThemeProvider';
import DynamicLogo from '../../components/logos/DynamicLogo';
import api from '../../services/api';

const ResetPasswordPage = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const primaryColor = currentTheme?.primary || '#1e40af';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      setError('Invalid or missing reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      setMessage(response.data.message || 'Password successfully reset.');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Password reset successful. Please log in.' } });
      }, 3000);
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
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-base-content/70">
          Please enter your new password below.
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
                    <p className="text-xs text-success/70 mt-1">Redirecting to login...</p>
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

            {!token && !message && !error && (
              <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-warning/90">No reset token found in URL. Please use the link from your email.</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-base-content mb-1">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  disabled={!token || message}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
                  style={{ '--tw-ring-color': primaryColor }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-1">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  disabled={!token || message}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
                  style={{ '--tw-ring-color': primaryColor }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !token || message}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: primaryColor,
                  '--tw-ring-color': primaryColor,
                }}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Reset Password'
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
                  Or go back to
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/login"
                className="font-medium hover:underline transition-colors duration-200"
                style={{ color: primaryColor }}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
