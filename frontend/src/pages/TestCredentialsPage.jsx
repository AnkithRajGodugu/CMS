import { Link } from 'react-router-dom';
import { FaCopy, FaCheckCircle, FaShieldAlt } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'sonner';

const TestCredentialsPage = () => {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // ⚠️ These match exactly what DataInitializer seeds via authService.createUser()
  const testCredentials = [
    {
      role: 'Admin',
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      sector: 'All Sectors',
      dashboard: '/dashboard/banking',
      color: 'badge-error',
      description: 'Full system access — can view all sector dashboards'
    },
    {
      role: 'Banking User',
      username: 'bank_user1',
      email: 'banking@example.com',
      password: 'bank123',
      sector: 'Banking & Finance',
      dashboard: '/dashboard/banking',
      color: 'badge-info',
      description: 'Access to banking accounts, transactions, compliance & risk'
    },
    {
      role: 'Banking Admin',
      username: 'bank_admin',
      email: 'bank_admin@example.com',
      password: 'admin123',
      sector: 'Banking & Finance',
      dashboard: '/dashboard/banking',
      color: 'badge-info',
      description: 'Sector Admin with access to Banking management'
    },
    {
      role: 'Healthcare User',
      username: 'health_user',
      email: 'healthcare@example.com',
      password: 'health123',
      sector: 'Healthcare',
      dashboard: '/dashboard/healthcare',
      color: 'badge-success',
      description: 'Access to patient records, appointments, and medical history'
    },
    {
      role: 'Healthcare Admin',
      username: 'health_admin',
      email: 'health_admin@example.com',
      password: 'admin123',
      sector: 'Healthcare',
      dashboard: '/dashboard/healthcare',
      color: 'badge-success',
      description: 'Sector Admin with access to Healthcare management'
    },
    {
      role: 'Logistics User',
      username: 'logistics_user',
      email: 'logistics@example.com',
      password: 'logistics123',
      sector: 'Logistics & Supply',
      dashboard: '/dashboard/logistics',
      color: 'badge-warning',
      description: 'Access to shipments, inventory, fleet, routes, and SLA tracking'
    },
    {
      role: 'Logistics Admin',
      username: 'logistics_admin',
      email: 'logistics_admin@example.com',
      password: 'admin123',
      sector: 'Logistics & Supply',
      dashboard: '/dashboard/logistics',
      color: 'badge-warning',
      description: 'Sector Admin with access to Logistics management'
    },
    {
      role: 'Content User',
      username: 'content_user',
      email: 'content@example.com',
      password: 'content123',
      sector: 'Content Creation',
      dashboard: '/dashboard/content',
      color: 'badge-secondary',
      description: 'Access to projects, assets, calendar, time tracking, and collaboration'
    },
    {
      role: 'Content Admin',
      username: 'content_admin',
      email: 'content_admin@example.com',
      password: 'admin123',
      sector: 'Content Creation',
      dashboard: '/dashboard/content',
      color: 'badge-secondary',
      description: 'Sector Admin with access to Content management'
    }
  ];

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaShieldAlt className="text-4xl text-primary" />
            <h1 className="text-4xl font-extrabold">Test Credentials</h1>
          </div>
          <p className="text-base-content/60 text-lg max-w-xl mx-auto">
            Use these credentials to test all user roles and sector dashboards. Login with <strong>username</strong> OR <strong>email</strong>.
          </p>
          <Link to="/login" className="btn btn-primary mt-6 gap-2">
            → Go to Login
          </Link>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {testCredentials.map((cred, index) => (
            <div key={index} className="card bg-base-100 shadow-xl border-t-4 border-primary/20 hover:shadow-2xl transition-shadow">
              <div className="card-body gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="card-title font-extrabold text-lg">{cred.role}</h3>
                  <span className={`badge ${cred.color} badge-sm`}>{cred.sector}</span>
                </div>

                <p className="text-sm text-base-content/60">{cred.description}</p>

                {/* Username */}
                <div className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Username</span>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => copyToClipboard(cred.username, `user-${index}`)}
                    >
                      {copied === `user-${index}` ? <FaCheckCircle className="text-success" /> : <FaCopy />}
                    </button>
                  </div>
                  <code className="text-sm font-bold text-primary">{cred.username}</code>
                </div>

                {/* Email */}
                <div className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Email (alt login)</span>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => copyToClipboard(cred.email, `email-${index}`)}
                    >
                      {copied === `email-${index}` ? <FaCheckCircle className="text-success" /> : <FaCopy />}
                    </button>
                  </div>
                  <code className="text-sm font-bold">{cred.email}</code>
                </div>

                {/* Password */}
                <div className="bg-base-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-wider">Password</span>
                    <button
                      className="btn btn-ghost btn-xs gap-1"
                      onClick={() => copyToClipboard(cred.password, `pw-${index}`)}
                    >
                      {copied === `pw-${index}` ? <FaCheckCircle className="text-success" /> : <FaCopy />}
                    </button>
                  </div>
                  <code className="text-sm font-bold text-success">{cred.password}</code>
                </div>

                <Link to={cred.dashboard} className="btn btn-outline btn-sm btn-primary w-full mt-2">
                  Open Dashboard →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="alert alert-info max-w-3xl mx-auto shadow">
          <FaShieldAlt className="text-xl flex-shrink-0" />
          <div>
            <h3 className="font-bold">Development Credentials</h3>
            <p className="text-sm">These accounts are auto-seeded on first startup. All emails are auto-verified. In production, users must register and verify their email address.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCredentialsPage;
