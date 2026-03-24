import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const UserProfilePage = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock form state for UI purposes
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || 'user@example.com',
        phone: '+1 (555) 123-4567',
        role: user?.role || 'USER',
        sector: user?.sector || 'Banking'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In reality, this would call userService.updateProfile(formData)
        setIsEditing(false);
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
                        <div className="avatar placeholder mb-4">
                            <div className="bg-primary text-primary-content rounded-full w-24">
                                <span className="text-3xl uppercase">
                                    {formData.username.charAt(0) || 'U'}
                                </span>
                            </div>
                        </div>
                        <h2 className="card-title text-xl">{formData.username}</h2>
                        <p className="text-base-content/60 text-sm mb-2">{formData.email}</p>
                        
                        <div className="flex gap-2 mt-2">
                            <span className="badge badge-primary badge-outline capitalize">{formData.sector}</span>
                            <span className="badge badge-neutral capitalize">{formData.role.toLowerCase()}</span>
                        </div>
                        
                        <button className="btn btn-outline btn-sm w-full mt-6">
                            Change Avatar
                        </button>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Username</span></label>
                                    <input 
                                        type="text" 
                                        name="username"
                                        value={formData.username} 
                                        onChange={handleChange}
                                        className="input input-bordered w-full" 
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Email Address</span></label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email} 
                                        onChange={handleChange}
                                        className="input input-bordered w-full" 
                                        disabled={!isEditing}
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
                                <div className="form-control hidden md:block">
                                    {/* Empty grid cell filler */}
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

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 border-t pt-4 border-base-200 gap-4">
                                <div>
                                    <h4 className="font-medium">Two-Factor Authentication</h4>
                                    <p className="text-sm text-base-content/60">{`Add an extra layer of security`}</p>
                                </div>
                                <input type="checkbox" className="toggle toggle-primary" defaultChecked />
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
