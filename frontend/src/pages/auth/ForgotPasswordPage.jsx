import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Email is required.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="card-title justify-center text-2xl">Check your email</h2>
            <p className="text-base-content/60">
              If an account with <strong>{email}</strong> exists, we've sent a password reset link.
            </p>
            <div className="mt-4">
              <Link to="/login" className="btn btn-primary btn-block">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">

          <h1 className="card-title text-2xl justify-center mb-1">Forgot Password</h1>
          <p className="text-center text-base-content/60 text-sm mb-4">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Email Address</span></label>
              <input
                id="forgot-email"
                type="email"
                className="input input-bordered"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="alert alert-error py-2 text-sm">{error}</div>
            )}

            <button
              id="forgot-submit"
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/login" className="link link-hover text-sm text-base-content/60">
              ← Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
