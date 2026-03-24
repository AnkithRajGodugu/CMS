import { Link, useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 text-center">
            <div className="max-w-lg w-full">
                {/* Animated 404 number */}
                <div className="relative mb-8">
                    <h1 className="text-[10rem] font-black leading-none select-none"
                        style={{
                            background: 'linear-gradient(135deg, var(--color-primary, #1e40af) 0%, #6366f1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        404
                    </h1>
                    {/* Floating decorations */}
                    <div className="absolute top-4 right-10 w-6 h-6 rounded-full opacity-40 animate-bounce"
                        style={{ background: 'var(--color-primary, #1e40af)', animationDelay: '0.1s' }} />
                    <div className="absolute top-12 left-12 w-4 h-4 rounded-full opacity-30 animate-bounce"
                        style={{ background: 'var(--color-accent, #f59e0b)', animationDelay: '0.3s' }} />
                    <div className="absolute bottom-4 right-20 w-3 h-3 rounded-full opacity-50 animate-bounce"
                        style={{ background: 'var(--color-primary, #1e40af)', animationDelay: '0.5s' }} />
                </div>

                {/* Message */}
                <div className="card bg-base-100 shadow-2xl p-8 border"
                    style={{ borderColor: 'var(--color-border, #e2e8f0)' }}>
                    <div className="text-5xl mb-4">🗺️</div>
                    <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                    <p className="text-base-content/60 mb-6">
                        The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn btn-outline"
                        >
                            ← Go Back
                        </button>
                        <Link to="/" className="btn btn-primary text-white">
                            🏠 Go Home
                        </Link>
                        <Link to="/sectors" className="btn btn-ghost">
                            View Sectors
                        </Link>
                    </div>
                </div>

                <p className="text-xs text-base-content/40 mt-6">
                    Error code: 404 • Page not found
                </p>
            </div>
        </div>
    );
};

export default NotFoundPage;
