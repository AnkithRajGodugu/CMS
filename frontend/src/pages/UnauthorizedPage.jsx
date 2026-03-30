import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UnauthorizedPage = () => {
  const { user, sector } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="card-title text-2xl justify-center mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-6">
            You don't have permission to access this page.
            {user && (
              <span className="block mt-2">
                Current role: <span className="badge badge-outline">{user.role}</span>
              </span>
            )}
          </p>
          <div className="card-actions justify-center">
            <Link to="/" className="btn btn-primary">
              Go Home
            </Link>
            {user && (
              <Link to={`/dashboard/${(sector?.code || 'banking').toLowerCase()}`} className="btn btn-outline">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
