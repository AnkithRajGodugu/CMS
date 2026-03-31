import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { login as authLogin } from '../../utils/auth';
import { getHomeRoute } from '../../utils/roleUtils';
import api from '../../services/api';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFaCode, setTwoFaCode] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Message passed back from ResetPasswordPage after a successful reset
    const successMessage = location.state?.successMessage || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const loginData = await authLogin(formData.username, formData.password);

            if (loginData.requires2FA) {
                setRequires2FA(true);
                setIsLoading(false);
                return;
            }

            console.log("LOGIN DATA:", loginData);

            // 🔥 Update React context (VERY IMPORTANT)
            login(loginData);

            // 🔥 SAFE sector extraction (handles string OR object)
            let sectorCode = null;

            if (typeof loginData?.sector === 'string') {
                sectorCode = loginData.sector.toLowerCase();
            } else if (loginData?.sector?.code) {
                sectorCode = loginData.sector.code.toLowerCase();
            }

            console.log("SECTOR CODE:", sectorCode);

            // 🔥 Safe navigation using roleUtils
            const redirectPath = getHomeRoute(loginData.user, sectorCode);
            navigate(redirectPath);

        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FASubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/2fa/authenticate', {
                username: formData.username,
                code: twoFaCode
            });
            const loginData = res.data;

            // 🔥 Store credentials in localStorage (Crucial for page refreshes)
            if (loginData.token) {
                const { setAuthToken, setUserData, setSectorData } = await import('../../utils/auth');
                setAuthToken(loginData.token);
                if (loginData.user) setUserData(loginData.user);
                if (loginData.sector) setSectorData(loginData.sector);
            }

            login(loginData);

            let sectorCode = null;
            if (typeof loginData?.sector === 'string') {
                sectorCode = loginData.sector.toLowerCase();
            } else if (loginData?.sector?.code) {
                sectorCode = loginData.sector.code.toLowerCase();
            }
            const redirectPath = getHomeRoute(loginData.user || { role: loginData.role }, sectorCode);
            navigate(redirectPath);
        } catch (err) {
            console.error('2FA error:', err);
            setError(err.userMessage || 'Invalid 2FA code.');
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

    const fillCredentials = (username, password) => {
        setFormData({ username, password });
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

                        {successMessage && (
                            <div className="alert alert-success mb-4">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div className="alert alert-error mb-4">
                                <span>{error}</span>
                            </div>
                        )}

                        {requires2FA ? (
                            <form onSubmit={handle2FASubmit} className="space-y-6">
                                <div className="text-center mb-4 text-sm text-base-content/70">
                                    Enter the 6-digit code from your authenticator app.
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Authenticator Code</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={twoFaCode}
                                        onChange={(e) => setTwoFaCode(e.target.value)}
                                        className="input input-bordered text-center tracking-[0.5em] font-mono text-xl"
                                        placeholder="000000"
                                        maxLength="6"
                                        required
                                        autoFocus
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="form-control">
                                    <button
                                        type="submit"
                                        className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                                        disabled={isLoading || twoFaCode.length !== 6}
                                    >
                                        Verify Code
                                    </button>
                                </div>
                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setRequires2FA(false); setTwoFaCode(''); }}
                                        className="btn btn-ghost btn-sm"
                                        disabled={isLoading}
                                    >
                                        Back to Login
                                    </button>
                                </div>
                            </form>
                        ) : (
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

                                <div className="form-control mb-6">
                                    <label className="label pb-1">
                                        <span className="label-text font-medium">Password</span>
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input input-bordered w-full focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Enter your password"
                                        required
                                        disabled={isLoading}
                                    />
                                    
                                    <label className="label justify-end pt-2 pb-0">
                                        <Link
                                            to="/forgot-password"
                                            className="label-text-alt text-primary font-medium hover:underline transition-all"
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
                        )}

                        <div className="divider">OR</div>

                        <div className="text-center">
                            <Link
                                to="/test-credentials"
                                className="btn btn-ghost btn-sm text-base-content/60 mb-2"
                            >
                                View All Test Credentials
                            </Link>

                            <div className="bg-base-200 rounded-lg p-3">
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">Quick Login (Auto-fill)</p>

                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <button onClick={() => fillCredentials('bank_user1', 'admin123')} type="button" className="btn btn-xs btn-outline btn-info">Bank User</button>
                                    <button onClick={() => fillCredentials('bank_admin', 'admin123')} type="button" className="btn btn-xs btn-info">Bank Admin</button>

                                    <button onClick={() => fillCredentials('dr_priya', 'admin123')} type="button" className="btn btn-xs btn-outline btn-success">Health User</button>
                                    <button onClick={() => fillCredentials('health_admin', 'admin123')} type="button" className="btn btn-xs btn-success">Health Admin</button>

                                    <button onClick={() => fillCredentials('driver_raj', 'admin123')} type="button" className="btn btn-xs btn-outline btn-warning">Logistics User</button>
                                    <button onClick={() => fillCredentials('logistics_admin', 'admin123')} type="button" className="btn btn-xs btn-warning">Logistics Admin</button>

                                    <button onClick={() => fillCredentials('creator_priya', 'admin123')} type="button" className="btn btn-xs btn-outline btn-secondary">Content User</button>
                                    <button onClick={() => fillCredentials('content_admin', 'admin123')} type="button" className="btn btn-xs btn-secondary">Content Admin</button>
                                </div>
                                <button onClick={() => fillCredentials('admin', 'admin123')} type="button" className="btn btn-xs btn-error w-full">Super Admin</button>
                            </div>
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
