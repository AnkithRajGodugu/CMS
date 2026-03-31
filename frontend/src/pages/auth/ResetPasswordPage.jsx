import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../context/SectorThemeProvider';
import DynamicLogo from '../../components/logos/DynamicLogo';
import api from '../../services/api';

// ── Password strength ─────────────────────────────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Very weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score, label: 'Fair', color: '#eab308' };
  if (score === 4) return { score, label: 'Strong', color: '#22c55e' };
  return { score: 5, label: 'Very strong', color: '#10b981' };
};

const PasswordStrengthBar = ({ password }) => {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  const segments = 5;
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < score ? color : 'var(--fallback-b3,oklch(var(--b3)/1))' }}
          />
        ))}
      </div>
      <p className="text-xs" style={{ color }}>{label}</p>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const ResetPasswordPage = () => {
  const { currentTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating' | 'valid' | 'invalid'
  const [tokenError, setTokenError] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const primaryColor = currentTheme?.primary || '#1e40af';

  // ── Token pre-validation on mount ──────────────────────────────────────────
  useEffect(() => {
    if (!token) {
      setTokenStatus('invalid');
      setTokenError('No reset token found in the URL. Please use the link from your email.');
      return;
    }

    let cancelled = false;
    const validate = async () => {
      try {
        // This hits GET /api/auth/validate-reset-token?token=... (public endpoint)
        const res = await api.get(`/auth/validate-reset-token?token=${encodeURIComponent(token)}`);
        if (!cancelled) {
          if (res.data.valid) {
            setTokenStatus('valid');
          } else {
            setTokenStatus('invalid');
            setTokenError(res.data.message || 'This reset link has expired or is invalid.');
          }
        }
      } catch {
        if (!cancelled) {
          // Network error — let the user try anyway (server will reject if expired)
          setTokenStatus('valid');
        }
      }
    };

    validate();
    return () => { cancelled = true; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

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
        navigate('/login', {
          state: { successMessage: 'Password reset successfully. You can now log in with your new password.' },
        });
      }, 2500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Render: validating ─────────────────────────────────────────────────────
  const renderValidating = () => (
    <div className="text-center py-8 space-y-4">
      <span className="loading loading-spinner loading-lg" style={{ color: primaryColor }} />
      <p className="text-sm text-base-content/60">Validating your reset link…</p>
    </div>
  );

  // ── Render: invalid token ──────────────────────────────────────────────────
  const renderInvalidToken = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-base-content mb-2">Link expired or invalid</h3>
        <p className="text-sm text-base-content/70 leading-relaxed">
          {tokenError}
        </p>
      </div>
      <Link
        to="/forgot-password"
        className="inline-flex items-center gap-2 py-2.5 px-6 rounded-md text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
        style={{ backgroundColor: primaryColor }}
      >
        Request a new link
      </Link>
    </div>
  );

  // ── Render: success ────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
        style={{ backgroundColor: '#22c55e20' }}>
        <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm text-success font-medium">{message}</p>
      <p className="text-xs text-base-content/50">Redirecting to login…</p>
    </div>
  );

  // ── Render: password form ──────────────────────────────────────────────────
  const renderForm = () => (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-error/10 border-l-4 border-error p-4 rounded-md">
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* New Password */}
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-base-content mb-1">
          New Password
        </label>
        <div className="relative">
          <input
            id="newPassword"
            type={showNew ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 pr-10 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
            style={{ '--tw-ring-color': primaryColor }}
            placeholder="Minimum 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowNew(v => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
            tabIndex={-1}
          >
            {showNew ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        <PasswordStrengthBar password={newPassword} />
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-base-content mb-1">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 pr-10 border border-base-300 rounded-md shadow-sm placeholder-base-content/40 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-base-100 text-base-content"
            style={{ '--tw-ring-color': primaryColor }}
            placeholder="Re-enter your new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
            tabIndex={-1}
          >
            {showConfirm ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {/* Match indicator */}
        {confirmPassword && (
          <p className={`text-xs mt-1 ${newPassword === confirmPassword ? 'text-success' : 'text-error'}`}>
            {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !newPassword || newPassword !== confirmPassword}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: primaryColor, '--tw-ring-color': primaryColor }}
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : 'Reset Password'}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <DynamicLogo size={48} animated={true} />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-base-content tracking-tight">
          {tokenStatus === 'invalid' ? 'Link Expired' : 'Set new password'}
        </h2>
        {tokenStatus === 'valid' && (
          <p className="mt-2 text-center text-sm text-base-content/70">
            Please enter your new password below.
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-base-100 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-base-300">
          {tokenStatus === 'validating' && renderValidating()}
          {tokenStatus === 'invalid' && renderInvalidToken()}
          {tokenStatus === 'valid' && !message && renderForm()}
          {tokenStatus === 'valid' && message && renderSuccess()}

          {/* Footer */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-100 text-base-content/60">Or go back to</span>
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
