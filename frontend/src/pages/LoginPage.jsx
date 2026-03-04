import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login as authLogin } from '../utils/auth';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginData = await authLogin(formData.username, formData.password);

      console.log("LOGIN RESPONSE:", loginData);

      login(loginData);

      // 🔥 Correct sector-based redirect
      const sectorCode = loginData?.sector?.code?.toUpperCase();

      if (sectorCode === "BANKING") {
        navigate("/dashboard/banking");
      } 
      else if (sectorCode === "HEALTHCARE") {
        navigate("/dashboard/healthcare");
      } 
      else if (sectorCode === "LOGISTICS") {
        navigate("/dashboard/logistics");
      } 
      else if (sectorCode === "CONTENT") {
        navigate("/dashboard/content");
      } 
      else {
        navigate("/sectors");
      }

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">

      <div className="max-w-md w-full">

        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold gradient-text">
            CMS Platform
          </Link>

          <h1 className="text-2xl font-bold mt-4 mb-2">
            Welcome Back
          </h1>

          <p className="text-base-content/70">
            Sign in to your account
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Username
                  </span>
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">

                <label className="label">
                  <span className="label-text">
                    Password
                  </span>
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />

                <label className="label">
                  <Link
                    to="/forgot-password"
                    className="label-text-alt link link-hover"
                  >
                    Forgot password?
                  </Link>
                </label>

              </div>

              <div className="form-control">
                <button
                  type="submit"
                  className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>

            </form>

            <div className="divider">OR</div>

            <div className="text-center">
              <Link
                to="/test-credentials"
                className="btn btn-outline btn-sm"
              >
                View Test Credentials
              </Link>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-base-content/70">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="link link-primary"
                >
                  Sign up
                </Link>
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};

export default LoginPage;