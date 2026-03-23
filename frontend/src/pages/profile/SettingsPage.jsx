import { useContext, useState } from 'react';
import { AuthContext } from '../../context/auth';
import api from '../../services/api';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState(user?.firstName || '');
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
              <div className="grid grid-cols-2 gap-4">
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

      </div>
    </div>
  );
};

export default SettingsPage;
