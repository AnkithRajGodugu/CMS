import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

const doctors = [
    { id: 'dr-smith', name: 'Dr. Sarah Smith', specialty: 'General Practice' },
    { id: 'dr-jones', name: 'Dr. Michael Jones', specialty: 'Cardiology' },
    { id: 'dr-lee', name: 'Dr. Anna Lee', specialty: 'Pediatrics' },
];

const AppointmentCalendarView = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
    
    // Default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedDoctor || !selectedDate) return;
            setIsLoading(true);
            try {
                // e.g. GET /api/sectors/healthcare/doctors/Dr. Sarah Smith/availability?date=2023-11-20
                const res = await api.get(`/sectors/healthcare/doctors/${encodeURIComponent(selectedDoctor.name)}/availability?date=${selectedDate}`);
                setAvailableSlots(res.data || []);
                setSelectedSlot(null);
            } catch (err) {
                console.error("Failed to fetch slots", err);
                toast.error("Failed to load doctor availability.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedDoctor, selectedDate]);

    const handleBookAppointment = async () => {
        if (!selectedSlot) return;
        setIsBooking(true);
        try {
            const appointmentTime = `${selectedDate}T${selectedSlot}:00`;

            const payload = {
                doctorName: selectedDoctor.name,
                appointmentTime: appointmentTime,
                type: 'CHECKUP',
                status: 'PENDING',
                notes: 'Booked via Smart Scheduler'
            };

            await api.post('/sectors/healthcare/appointments', payload);
            toast.success('Appointment booked successfully!');
            
            // Remove the booked slot from the list immediately
            setAvailableSlots(prev => prev.filter(s => s !== selectedSlot));
            setSelectedSlot(null);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || 'Failed to book appointment. Time slot may be taken.');
            
            // If conflict, refresh slots
            if (err.response?.status === 409) {
                const res = await api.get(`/sectors/healthcare/doctors/${encodeURIComponent(selectedDoctor.name)}/availability?date=${selectedDate}`);
                setAvailableSlots(res.data || []);
                setSelectedSlot(null);
            }
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl mt-8">
            <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Smart Appointment Scheduling</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Filters */}
                    <div className="col-span-1 space-y-6">
                        
                        <div className="form-control">
                            <label className="label"><span className="label-text font-bold">1. Select Doctor</span></label>
                            <select 
                                className="select select-bordered w-full"
                                value={selectedDoctor.id}
                                onChange={(e) => setSelectedDoctor(doctors.find(d => d.id === e.target.value))}
                            >
                                {doctors.map(doc => (
                                    <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control">
                            <label className="label"><span className="label-text font-bold">2. Select Date</span></label>
                            <input 
                                type="date" 
                                className="input input-bordered w-full" 
                                value={selectedDate}
                                min={new Date().toISOString().split('T')[0]} // prevent past dates
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Column: Time Slots */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="label"><span className="label-text font-bold text-lg">3. Available Slots for {selectedDate}</span></label>
                        
                        <div className="bg-base-200/50 rounded-xl p-6 min-h-[250px] flex flex-col">
                            {isLoading ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-base-content/50">
                                    <span className="loading loading-spinner loading-lg mb-4"></span>
                                    <p>Checking schedule...</p>
                                </div>
                            ) : availableSlots.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-base-content/50 text-center">
                                    <div className="text-4xl mb-3">📭</div>
                                    <p className="font-medium">No slots available on this date.</p>
                                    <p className="text-sm">Please select a different date or doctor.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {availableSlots.map((slot) => {
                                        // Format "09:00" -> "9:00 AM"
                                        const [hour, min] = slot.split(':');
                                        const h = parseInt(hour, 10);
                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                        const h12 = h % 12 || 12;
                                        const label = `${h12}:${min} ${ampm}`;
                                        
                                        const isSelected = selectedSlot === slot;

                                        return (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`btn btn-sm sm:btn-md transition-all ${
                                                    isSelected 
                                                        ? 'btn-primary shadow-lg scale-105' 
                                                        : 'btn-outline border-base-300 bg-base-100 hover:border-primary'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Booking Action */}
                        <div className="mt-6 flex justify-end">
                            <button 
                                className={`btn btn-primary px-8 ${isBooking ? 'loading' : ''}`}
                                disabled={!selectedSlot || isBooking}
                                onClick={handleBookAppointment}
                            >
                                {isBooking ? 'Booking...' : (selectedSlot ? `Book for ${selectedSlot}` : 'Select a time slot')}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AppointmentCalendarView;
