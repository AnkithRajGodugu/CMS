import React from 'react';

const TelemedicineModal = ({ appointment, isOpen, onClose }) => {
    if (!isOpen || !appointment) return null;

    // Use appointment ID to create a unique Jitsi room name
    const roomName = `cms-appointment-${appointment.id}-${appointment.appointmentId || 'visit'}`;
    const jitsiUrl = `https://meet.jit.si/${roomName}`;

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden relative">
                
                {/* Header */}
                <div className="bg-base-200 p-4 flex justify-between items-center border-b border-base-300">
                    <div>
                        <h3 className="font-bold text-lg">Virtual Visit</h3>
                        <p className="text-sm opacity-70">
                            Dr. {appointment.doctorName} &bull; Patient: {appointment.patientName}
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
                </div>

                {/* Video Frame */}
                <div className="flex-1 bg-black relative">
                    <iframe
                        title="Telemedicine Video Call"
                        src={jitsiUrl}
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                        className="w-full h-full border-none"
                    />
                </div>
                
                {/* Footer Warning */}
                <div className="bg-warning/10 text-warning p-2 text-center text-xs">
                    This is a secure peer-to-peer connection. CMS does not record telemedicine sessions.
                </div>
            </div>
            
            <div className="modal-backdrop bg-black/70" onClick={onClose}></div>
        </div>
    );
};

export default TelemedicineModal;
