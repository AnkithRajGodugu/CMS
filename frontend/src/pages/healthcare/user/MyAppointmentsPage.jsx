import { useState } from 'react';
import { bookAppointment } from '../../../services/healthcareService';
import { toast } from 'sonner';

const MyAppointmentsPage = () => {
    const [activeTab, setActiveTab] = useState('upcoming');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        department: '',
        reason: '',
        date: ''
    });

    const handleBook = async () => {
        setLoading(true);
        try {
            await bookAppointment(formData);
            toast.success('Appointment booked successfully!');
            setShowBookingModal(false);
            setFormData({ department: '', reason: '', date: '' });
        } catch (error) {
            console.error('Failed to book appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Appointments</h1>
                    <p className="text-base-content/60">Manage your upcoming visits and view past appointments.</p>
                </div>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowBookingModal(true)}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Book New Appointment
                </button>
            </div>

            <div className="tabs tabs-boxed bg-base-200/50 p-1 w-fit">
                <button 
                    className={`tab px-6 ${activeTab === 'upcoming' ? 'tab-active bg-primary text-primary-content' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button 
                    className={`tab px-6 ${activeTab === 'past' ? 'tab-active bg-primary text-primary-content' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past Visits
                </button>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-base-200/50">
                                    <th className="rounded-tl-xl p-4">Date & Time</th>
                                    <th>Doctor / Department</th>
                                    <th>Reason for Visit</th>
                                    <th>Status</th>
                                    <th className="rounded-tr-xl text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'upcoming' ? (
                                    <>
                                        <tr className="hover">
                                            <td className="p-4">
                                                <div className="font-bold">Tomorrow</div>
                                                <div className="text-sm opacity-70">10:30 AM (45 min)</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-10 h-10 bg-primary/20 text-primary flex items-center justify-center font-bold">
                                                            SJ
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Dr. Sarah Jenkins</div>
                                                        <div className="text-sm opacity-50">Cardiology</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Routine Checkup</td>
                                            <td><span className="badge badge-primary badge-outline">Confirmed</span></td>
                                            <td className="text-right">
                                                <button className="btn btn-ghost btn-sm mr-2">Reschedule</button>
                                                <button className="btn btn-ghost btn-sm text-error">Cancel</button>
                                            </td>
                                        </tr>
                                        <tr className="hover">
                                            <td className="p-4">
                                                <div className="font-bold">Nov 15, 2023</div>
                                                <div className="text-sm opacity-70">2:00 PM (30 min)</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-10 h-10 bg-accent/20 text-accent flex items-center justify-center font-bold">
                                                            MR
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Dr. Michael Ross</div>
                                                        <div className="text-sm opacity-50">General Practice</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Annual Physical</td>
                                            <td><span className="badge badge-warning badge-outline border-warning/50">Pending Approval</span></td>
                                            <td className="text-right">
                                                <button className="btn btn-ghost btn-sm mr-2">Reschedule</button>
                                                <button className="btn btn-ghost btn-sm text-error">Cancel</button>
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        <tr className="hover">
                                            <td className="p-4">
                                                <div className="font-bold">Sep 10, 2023</div>
                                                <div className="text-sm opacity-70">9:15 AM (30 min)</div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-10 h-10 bg-accent/20 text-accent flex items-center justify-center font-bold">
                                                            MR
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">Dr. Michael Ross</div>
                                                        <div className="text-sm opacity-50">General Practice</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>Follow-up Visit</td>
                                            <td><span className="badge badge-ghost">Completed</span></td>
                                            <td className="text-right">
                                                <button className="btn btn-outline btn-sm">View Notes</button>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                        
                        {activeTab === 'upcoming' && (
                            <div className="p-4 border-t border-base-200 bg-base-200/20 text-sm text-base-content/60 text-center">
                                Please arrive 15 minutes before your scheduled appointment time.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal placeholder (UI only) */}
            {showBookingModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg border-b pb-4 mb-4">Book New Appointment</h3>
                        <div className="space-y-4">
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Department</span></label>
                                <select 
                                    className="select select-bordered w-full"
                                    value={formData.department}
                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                >
                                    <option value="" disabled>Select department</option>
                                    <option value="General Practice">General Practice</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                </select>
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Reason for Visit</span></label>
                                <textarea 
                                    className="textarea textarea-bordered h-24" 
                                    placeholder="Briefly describe your symptoms or reason for visit..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="form-control w-full">
                                <label className="label"><span className="label-text">Preferred Date</span></label>
                                <input 
                                    type="date" 
                                    className="input input-bordered w-full" 
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="modal-action border-t pt-4 mt-6">
                            <button className="btn" onClick={() => setShowBookingModal(false)} disabled={loading}>Cancel</button>
                            <button 
                                className="btn btn-primary text-white" 
                                onClick={handleBook}
                                disabled={loading || !formData.department || !formData.date || !formData.reason}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Book Appointment'}
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={() => setShowBookingModal(false)}></div>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;
