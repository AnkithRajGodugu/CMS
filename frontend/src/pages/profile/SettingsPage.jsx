import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const SettingsPage = () => {
  const { user, login } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  
  // 2FA State
  const [is2FALoading, setIs2FALoading] = useState(false);
  
  // 3-State 2FA UI
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false); // For Setup (QR)
  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false); // For Enable (Existing)
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false); // For Disable
  
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAError, setTwoFAError] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  const [lastName, setLastName]   = useState(user?.lastName  || '');
  const [email, setEmail]         = useState(user?.email     || '');

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew]         = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const [profileMsg, setProfileMsg] = useState(null);
  const [pwdMsg,     setPwdMsg]     = useState(null);
  const [saving,     setSaving]     = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg(null);
    try {
      await api.put(`/users/${user?.id}`, { firstName, lastName, email });
      setProfileMsg({ ok: true, text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ ok: false, text: err.response?.data?.message || 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdNew !== pwdConfirm) {
      setPwdMsg({ ok: false, text: 'New passwords do not match.' });
      return;
    }
    setSaving(true);
    setPwdMsg(null);
    try {
      await api.post('/users/change-password', {
        currentPassword: pwdCurrent,
        newPassword: pwdNew,
      });
      setPwdMsg({ ok: true, text: 'Password changed successfully!' });
      setPwdCurrent(''); setPwdNew(''); setPwdConfirm('');
    } catch (err) {
      setPwdMsg({ ok: false, text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSetup2FA = async () => {
    setIs2FALoading(true);
    setTwoFAError('');
    try {
      const res = await api.post('/auth/2fa/setup');
      setQrCodeUrl(res.data.qrCodeUrl);
      setIs2FAModalOpen(true);
      setTwoFACode('');
    } catch (err) {
      console.error('Failed to setup 2FA', err);
      setTwoFAError('Failed to initialize 2FA setup. Please try again or contact support.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setIs2FALoading(true);
    setTwoFAError('');
    try {
      await api.post('/auth/2fa/enable', { code: twoFACode });
      setIs2FAModalOpen(false);
      setTwoFACode('');
      login({ user: { ...user, totpEnabled: true, hasTotpSecret: true } });
    } catch (err) {
      setTwoFAError(err.response?.data?.message || 'Invalid code');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleEnableExisting2FA = () => {
    setIs2FALoading(false);
    setTwoFACode('');
    setTwoFAError('');
    setIsEnableModalOpen(true);
  };

  const confirmEnable2FA = async (e) => {
    if (e) e.preventDefault();
    setIs2FALoading(true);
    setTwoFAError('');
    try {
      // We can reuse the same endpoint if it just takes a code and enables TOTP
      await api.post('/auth/2fa/enable', { code: twoFACode });
      setIsEnableModalOpen(false);
      setTwoFACode('');
      login({ user: { ...user, totpEnabled: true, hasTotpSecret: true } });
    } catch (err) {
      setTwoFAError(err.response?.data?.message || 'Invalid code. Could not enable 2FA.');
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = () => {
    setIsDisableModalOpen(true);
    setTwoFACode('');
    setTwoFAError('');
  };

  const confirmDisable2FA = async (e) => {
    if (e) e.preventDefault();
    setIs2FALoading(true);
    setTwoFAError('');
    try {
      await api.post('/auth/2fa/disable', { code: twoFACode });
      setIsDisableModalOpen(false);
      setTwoFACode('');
      login({ user: { ...user, totpEnabled: false, hasTotpSecret: true } });
    } catch (err) {
      setTwoFAError(err.response?.data?.message || 'Invalid code. Could not disable 2FA.');
    } finally {
      setIs2FALoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-8 max-w-2xl mx-auto">

        
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-base-content/60">Manage your profile and security</p>
        </div>

        {/* Profile Info Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Profile Information</h2>

            {/* Avatar placeholder */}
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-16 text-2xl flex items-center justify-center">
                  {(firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
                </div>
              </div>
              <div>
                <p className="font-semibold">{user?.username}</p>
                <p className="text-sm text-base-content/60">{user?.role}</p>
                <p className="text-xs text-base-content/40">Sector: {user?.sector?.name || '—'}</p>
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label"><span className="label-text">First Name</span></label>
                  <input id="settings-first-name" className="input input-bordered" value={firstName}
                    onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="form-control">
                  <label className="label"><span className="label-text">Last Name</span></label>
                  <input id="settings-last-name" className="input input-bordered" value={lastName}
                    onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input id="settings-email" type="email" className="input input-bordered" value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>

              {profileMsg && (
                <div className={`alert ${profileMsg.ok ? 'alert-success' : 'alert-error'} py-2`}>
                  {profileMsg.text}
                </div>
              )}

              <button id="settings-save-profile" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-xs"/> : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Current Password</span></label>
                <input id="pwd-current" type="password" className="input input-bordered"
                  value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)} required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">New Password</span></label>
                <input id="pwd-new" type="password" className="input input-bordered"
                  value={pwdNew} onChange={e => setPwdNew(e.target.value)} required />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Confirm New Password</span></label>
                <input id="pwd-confirm" type="password" className="input input-bordered"
                  value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} required />
              </div>

              {pwdMsg && (
                <div className={`alert ${pwdMsg.ok ? 'alert-success' : 'alert-error'} py-2`}>
                  {pwdMsg.text}
                </div>
              )}

              <button id="settings-change-pwd" className="btn btn-warning" disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-xs"/> : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="card bg-base-100 shadow-lg border border-base-200">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Two-Factor Authentication (TOTP)
            </h2>
            <p className="text-sm text-base-content/70 mb-4">
              Add an extra layer of security to your account by turning on 2FA. We support Google Authenticator, Authy, and more.
            </p>
            
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
              <div>
                <h3 className="font-semibold text-base">{user?.totpEnabled ? '2FA is currently Enabled' : '2FA is currently Disabled'}</h3>
                <p className="text-xs text-base-content/60 mt-1">
                  {user?.totpEnabled ? 'Your account is secured with two-factor authentication.' : 'We highly recommend turning this on.'}
                </p>
              </div>
              <div>
                {!user?.hasTotpSecret ? (
                  <button 
                    className={`btn btn-primary ${is2FALoading ? 'loading' : ''}`}
                    onClick={handleSetup2FA}
                    disabled={is2FALoading}
                  >
                    Setup 2FA
                  </button>
                ) : !user?.totpEnabled ? (
                  <button 
                    className={`btn btn-success text-white ${is2FALoading ? 'loading' : ''}`}
                    onClick={handleEnableExisting2FA}
                    disabled={is2FALoading}
                  >
                    Enable 2FA
                  </button>
                ) : (
                  <button 
                    className={`btn btn-outline btn-error ${is2FALoading ? 'loading' : ''}`}
                    onClick={handleDisable2FA}
                    disabled={is2FALoading}
                  >
                    Disable 2FA
                  </button>
                )}
              </div>
            </div>
            {twoFAError && !is2FAModalOpen && !isEnableModalOpen && !isDisableModalOpen && (
              <div className="mt-2 text-error text-sm font-medium flex items-center justify-end gap-2">
                <span>⚠️ {twoFAError}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 2FA Setup Modal (QR) */}
      {is2FAModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => { setIs2FAModalOpen(false); setTwoFACode(''); setTwoFAError(''); }}>✕</button>
            <h3 className="font-bold text-lg mb-2">Setup Two-Factor Authentication</h3>
            <p className="text-sm text-base-content/70 mb-6">
              1. Install an authenticator app (like Google Authenticator or Authy) on your phone.<br/>
              2. Scan the QR code below.
            </p>
            
            {qrCodeUrl && (
              <div className="flex justify-center p-4 bg-white rounded-xl mb-6 shadow-inner mx-auto w-fit">
                <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">3. Enter the 6-digit code to verify:</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered text-center tracking-[0.5em] font-mono text-xl focus:outline-primary/50"
                placeholder="000000"
                maxLength="6"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value)}
              />
              {twoFAError && <p className="text-error text-sm mt-2">{twoFAError}</p>}
            </div>

            <div className="w-full">
              <button 
                className={`btn btn-primary w-full ${is2FALoading ? 'loading' : ''}`}
                onClick={handleEnable2FA}
                disabled={twoFACode.length !== 6 || is2FALoading}
              >
                Verify & Enable
              </button>
            </div>
          </div>
          <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setIs2FAModalOpen(false)}></div>
        </div>
      )}

      {/* 2FA Re-Enable Modal (Existing Secret) */}
      {isEnableModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => { setIsEnableModalOpen(false); setTwoFACode(''); setTwoFAError(''); }}>✕</button>
            <h3 className="font-bold text-lg mb-4 text-success">Enable Two-Factor Authentication</h3>
            <p className="text-sm text-base-content/70 mb-6">
              You've already set up 2FA. Please enter the 6-digit code from your authenticator app to turn it back on.
            </p>

            <form onSubmit={confirmEnable2FA} className="space-y-4">
              <div className="form-control">
                <input 
                  type="text" 
                  className="input input-bordered text-center tracking-[0.5em] font-mono text-xl focus:outline-success/50"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoFocus
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                />
                {twoFAError && <p className="text-error text-sm mt-2">{twoFAError}</p>}
              </div>

              <div className="w-full pt-4">
                <button 
                  type="submit"
                  className={`btn btn-success w-full text-white ${is2FALoading ? 'loading' : ''}`}
                  disabled={twoFACode.length !== 6 || is2FALoading}
                >
                  Confirm & Enable
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setIsEnableModalOpen(false)}></div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {isDisableModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box relative">
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => { setIsDisableModalOpen(false); setTwoFACode(''); setTwoFAError(''); }}>✕</button>
            <h3 className="font-bold text-lg mb-4 text-error">Disable Two-Factor Authentication</h3>
            <p className="text-sm text-base-content/70 mb-6">
              Disabling 2FA will make your account less secure. Please enter your current 6-digit Authenticator code to confirm this action.
            </p>

            <form onSubmit={confirmDisable2FA} className="space-y-4">
              <div className="form-control">
                <input 
                  type="text" 
                  className="input input-bordered text-center tracking-[0.5em] font-mono text-xl focus:outline-error/50"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoFocus
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value)}
                />
                {twoFAError && <p className="text-error text-sm mt-2">{twoFAError}</p>}
              </div>

              <div className="w-full pt-4">
                <button 
                  type="submit"
                  className={`btn btn-error w-full text-white ${is2FALoading ? 'loading' : ''}`}
                  disabled={twoFACode.length !== 6 || is2FALoading}
                >
                  Confirm & Disable
                </button>
              </div>
            </form>
          </div>
          <div className="modal-backdrop bg-base-300/60 backdrop-blur-sm" onClick={() => setIsDisableModalOpen(false)}></div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
