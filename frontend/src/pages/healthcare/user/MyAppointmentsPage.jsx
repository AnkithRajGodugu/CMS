import { useState, useEffect } from 'react';
import { getMyAppointments } from '../../../services/healthcareService';
import { bookAppointment } from '../../../services/healthcareService';
import { toast } from 'sonner';
import TelemedicineModal from '../../../components/healthcare/TelemedicineModal';

const TYPE_LABELS = {
  CONSULTATION: 'Consultation',
  FOLLOW_UP:    'Follow-up',
  CHECK_UP:     'Check-up',
  EMERGENCY:    'Emergency',
};

const STATUS_BADGE = {
  CONFIRMED: 'badge-success',
  PENDING:   'badge-warning',
  URGENT:    'badge-error',
  COMPLETED: 'badge-ghost',
  CANCELLED: 'badge-ghost',
};

const isUpcoming = (a) => ['CONFIRMED', 'PENDING', 'URGENT'].includes(a.status);

const MyAppointmentsPage = () => {
  const [activeTab, setActiveTab]         = useState('upcoming');
  const [appointments, setAppointments]   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [submitting, setSubmitting]        = useState(false);
  const [formData, setFormData] = useState({ department: '', reason: '', date: '' });
  
  // Telemedicine state
  const [activeTelemedicineAppt, setActiveTelemedicineAppt] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await getMyAppointments(0, 50);
      const list = res.data?.content ?? res.data ?? [];
      setAppointments(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      toast.error('Could not load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleBook = async () => {
    setSubmitting(true);
    try {
      // Map frontend fields to backend entity
      const backendData = {
        appointmentTime: new Date(formData.date).toISOString().replace('Z', ''), // Simple LocalDateTime mapping
        type: formData.department === 'General Practice' ? 'CONSULTATION' : 
              formData.department === 'Emergency' ? 'EMERGENCY' : 
              formData.department === 'Cardiology' ? 'CHECK_UP' : 'FOLLOW_UP',
        notes: formData.reason,
      };

      await bookAppointment(backendData);
      toast.success('Appointment booked successfully!');
      setShowBookingModal(false);
      setFormData({ department: '', reason: '', date: '' });
      fetchAppointments(); // Refresh list
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const upcoming = appointments.filter(isUpcoming);
  const past     = appointments.filter(a => !isUpcoming(a));
  const displayed = activeTab === 'upcoming' ? upcoming : past;

  const fmtTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-base-content/60">Manage your upcoming visits and view past appointments.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Book New Appointment
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200/50 p-1 w-fit">
        <button className={`tab px-6 ${activeTab === 'upcoming' ? 'tab-active bg-primary text-primary-content' : ''}`}
          onClick={() => setActiveTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`tab px-6 ${activeTab === 'past' ? 'tab-active bg-primary text-primary-content' : ''}`}
          onClick={() => setActiveTab('past')}>
          Past Visits ({past.length})
        </button>
      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="p-4">Date & Time</th>
                  <th>Doctor</th>
                  <th>Type</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-10">
                    <span className="loading loading-spinner loading-md" />
                  </td></tr>
                ) : displayed.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-base-content/40">
                    {activeTab === 'upcoming' ? 'No upcoming appointments.' : 'No past visits.'}
                  </td></tr>
                ) : displayed.map(a => (
                  <tr key={a.id} className="hover">
                    <td className="p-4 font-medium">{fmtTime(a.appointmentTime)}</td>
                    <td>
                      <div className="font-bold">{a.doctorName}</div>
                      <div className="text-sm opacity-50">{a.patientName}</div>
                    </td>
                    <td>
                      <span className="badge badge-outline badge-sm">{TYPE_LABELS[a.type] ?? a.type}</span>
                    </td>
                    <td className="text-sm text-base-content/60 max-w-xs truncate">{a.notes ?? '—'}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[a.status] ?? 'badge-info'}`}>{a.status}</span>
                      {a.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => setActiveTelemedicineAppt(a)}
                          className="btn btn-xs btn-primary mt-2 flex items-center gap-1 w-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                          </svg>
                          Join Visit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {activeTab === 'upcoming' && !loading && upcoming.length > 0 && (
              <div className="p-4 border-t border-base-200 bg-base-200/20 text-sm text-base-content/60 text-center">
                Please arrive 15 minutes before your scheduled appointment time.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg border-b pb-4 mb-4">Book New Appointment</h3>
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Department</span></label>
                <select className="select select-bordered w-full"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}>
                  <option value="" disabled>Select department</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Reason for Visit</span></label>
                <textarea className="textarea textarea-bordered h-24"
                  placeholder="Briefly describe your symptoms or reason for visit..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
              <div className="form-control w-full">
                <label className="label"><span className="label-text">Preferred Date</span></label>
                <input type="date" className="input input-bordered w-full"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="modal-action border-t pt-4 mt-6">
              <button className="btn" onClick={() => setShowBookingModal(false)} disabled={submitting}>Cancel</button>
              <button className="btn btn-primary"
                onClick={handleBook}
                disabled={submitting || !formData.department || !formData.date || !formData.reason}>
                {submitting ? <span className="loading loading-spinner" /> : 'Book Appointment'}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowBookingModal(false)} />
        </div>
      )}

      {/* Telemedicine Modal */}
      <TelemedicineModal 
          isOpen={!!activeTelemedicineAppt} 
          appointment={activeTelemedicineAppt} 
          onClose={() => setActiveTelemedicineAppt(null)} 
      />
    </div>
  );
};

export default MyAppointmentsPage;
