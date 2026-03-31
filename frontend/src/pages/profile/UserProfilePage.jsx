import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const UserProfilePage = () => {
    const { user, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    
    // Enhanced Profile State
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        role: user?.role || 'USER',
        sector: user?.sector || 'Banking'
    });
    
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        // Fetch fresh profile data
        api.get('/users/profile')
            .then(res => {
                const data = res.data;
                setFormData(prev => ({
                    ...prev,
                    username: data.username || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    role: data.role || prev.role,
                    sector: data.sector?.name || prev.sector
                }));
                setAvatarUrl(data.avatarUrl);
                // Also update auth context if needed, but not strictly required if we just show it here
            })
            .catch(err => console.error("Failed to fetch profile", err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', {
                phone: formData.phone,
                bio: formData.bio
            });
            setIsEditing(false);
            // Optionally update context
        } catch (err) {
            console.error("Failed to update profile", err);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            // Note: Since api.js defaults to application/json, we need to override headers for multipart
            const res = await api.post('/users/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // The backend returns the local path /uploads/avatars/avatar_123.jpg. 
            // Depending on frontend proxy setup, we might need a full URL if api base URL is different
            setAvatarUrl(api.defaults.baseURL.replace('/api', '') + res.data.avatarUrl);
        } catch (err) {
            console.error("Failed to upload avatar", err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Avatar & Summary Card */}
                <div className="card bg-base-100 shadow-xl col-span-1 h-fit">
                    <div className="card-body items-center text-center">
                        <div className="avatar placeholder mb-4 relative group">
                            <div className="bg-primary text-primary-content rounded-full w-24 overflow-hidden outline outline-offset-2 outline-base-200">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl uppercase">
                                        {formData.username.charAt(0) || 'U'}
                                    </span>
                                )}
                            </div>
                            
                            {/* Hidden file input for avatar upload */}
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isUploading}
                            />
                        </div>
                        <h2 className="card-title text-xl">{formData.username}</h2>
                        <p className="text-base-content/60 text-sm mb-2">{formData.email}</p>
                        
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-primary badge-outline capitalize">{formData.sector}</span>
                            <span className="badge badge-neutral capitalize">{formData.role.toLowerCase()}</span>
                        </div>
                        
                        <label 
                            htmlFor="avatar-upload"
                            className={`btn btn-outline btn-sm w-full mt-6 cursor-pointer ${isUploading ? 'loading' : ''}`}
                        >
                            {isUploading ? 'Uploading...' : 'Change Avatar'}
                        </label>
                    </div>
                </div>

                {/* Details Form Card */}
                <div className="card bg-base-100 shadow-xl col-span-1 md:col-span-2">
                    <div className="card-body">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                            <button 
                                className="btn btn-ghost btn-sm"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit'}
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Username</span></label>
                                        <input 
                                            type="text" 
                                            name="username"
                                            value={formData.username} 
                                            className="input input-bordered w-full" 
                                            disabled={true} // Not allowing username change here
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Email Address</span></label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email} 
                                            className="input input-bordered w-full" 
                                            disabled={true} // Email changes usually require verification flow
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label"><span className="label-text">Phone Number</span></label>
                                        <input 
                                            type="text" 
                                            name="phone"
                                            value={formData.phone} 
                                            onChange={handleChange}
                                            className="input input-bordered w-full" 
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Short Bio</span></label>
                                    <textarea 
                                        name="bio"
                                        value={formData.bio} 
                                        onChange={handleChange}
                                        className="textarea textarea-bordered w-full" 
                                        disabled={!isEditing}
                                        rows="3"
                                        placeholder="Tell us a little bit about yourself..."
                                    />
                                </div>
                            </div>

                            <div className="divider">Security</div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-medium">Password</h4>
                                    <p className="text-sm text-base-content/60">Last changed 3 months ago</p>
                                </div>
                                <button type="button" className="btn btn-outline btn-sm">Update Password</button>
                            </div>



                            {isEditing && (
                                <div className="form-control mt-6">
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserProfilePage;
