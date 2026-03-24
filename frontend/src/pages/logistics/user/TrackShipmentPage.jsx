import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trackShipment } from '../../../services/logisticsService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'sonner';
import { getToken } from '../../../utils/auth';

const TrackShipmentPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTrackingId = searchParams.get('id') || '';
    
    const [trackingId, setTrackingId] = useState(initialTrackingId);
    const [isTracking, setIsTracking] = useState(!!initialTrackingId);
    const [loading, setLoading] = useState(false);

    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState(null);
    const clientRef = useRef(null);

    // Initial search or URL param change
    useEffect(() => {
        if (initialTrackingId) {
            handleSearch(null, initialTrackingId);
        }
    }, [initialTrackingId]);

    // Cleanup WebSocket on unmount
    useEffect(() => {
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    const handleSearch = async (e, forceId = null) => {
        if (e) e.preventDefault();
        const idToTrack = forceId || trackingId;
        if (!idToTrack) return;
        
        setSearchParams({ id: idToTrack });
        setLoading(true);
        
        try {
            // 1. Fetch initial shipment data
            await trackShipment(idToTrack); // Usually returns { status, events }
            
            // Mock initial state for preview
            setStatus('Out for Delivery');
            setEvents([
                { id: 1, title: 'Out for Delivery', location: 'Local Hub, NY', timestamp: new Date().toISOString() },
                { id: 2, title: 'In Transit', location: 'Regional Sort Center, NJ', timestamp: new Date(Date.now() - 86400000).toISOString() }
            ]);
            setIsTracking(true);
            
            // 2. Connect WebSocket for live updates
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
            
            const WS_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8082'}/ws`;
            const token = getToken();
            const client = new Client({
                webSocketFactory: () => new SockJS(`${WS_URL}?token=${token}`),
                reconnectDelay: 5000,
                onConnect: () => {
                    client.subscribe(`/topic/logistics/${idToTrack}`, (message) => {
                        try {
                            const update = JSON.parse(message.body);
                            // Expected update: { title, location, timestamp, newStatus }
                            setEvents(prev => [update, ...prev]);
                            if (update.newStatus) setStatus(update.newStatus);
                            toast.info(`Shipment Update: ${update.title}`);
                        } catch (err) {
                            console.error('Failed to parse shipment update', err);
                        }
                    });
                }
            });
            
            client.activate();
            clientRef.current = client;

        } catch (error) {
            console.error('Tracking failed:', error);
            // Default to preview mode anyway so UI looks good if backend is missing
            setIsTracking(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center py-6">
                <h1 className="text-3xl font-black mb-4">Track Your Shipment</h1>
                <form onSubmit={handleSearch} className="max-w-lg mx-auto w-full join">
                    <input 
                        type="text" 
                        placeholder="Enter Tracking ID (e.g., TRK-9824-771X)" 
                        className="input input-lg input-bordered join-item w-full bg-base-100 shadow-sm" 
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn btn-lg btn-primary join-item px-8 shadow-sm text-white border-primary border-r-0">
                        {loading ? <span className="loading loading-spinner"></span> : 'TRACK'}
                    </button>
                </form>
            </div>

            {isTracking && !loading && (
                <div className="card bg-base-100 shadow-xl border border-base-200 mt-8 animate-fade-in-up">
                    <div className="card-body">
                        {/* Header info */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-base-200 pb-6 mb-6 gap-4">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Tracking Number</div>
                                <h2 className="text-2xl font-bold flex items-center gap-3">
                                    {trackingId.toUpperCase()}
                                    <span className="badge badge-primary gap-1">
                                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div> Live
                                    </span>
                                </h2>
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-1">Status</div>
                                <h3 className="text-xl font-bold text-success">Out for Delivery</h3>
                                <p className="text-sm">Expected today by 5:00 PM</p>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="w-full h-64 bg-base-200 rounded-xl mb-8 relative border border-base-300 overflow-hidden flex items-center justify-center">
                            {/* Realistic looking map placeholder background */}
                            <div className="absolute inset-0 opacity-30" style={{ 
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }}></div>
                            
                            {/* Map pins and route */}
                            <svg className="w-full h-full absolute inset-0 z-10" viewBox="0 0 800 250" preserveAspectRatio="none">
                                <path d="M100 125 Q 300 50, 450 150 T 700 100" fill="none" stroke="hsl(var(--p))" strokeWidth="4" strokeDasharray="8 8" className="opacity-70 animate-[dash_2s_linear_infinite]" />
                                {/* Pin A */}
                                <circle cx="100" cy="125" r="8" fill="white" stroke="hsl(var(--nc))" strokeWidth="4" />
                                {/* Delivery Truck Location */}
                                <circle cx="580" cy="130" r="12" fill="hsl(var(--su))" className="animate-pulse shadow-lg" />
                                {/* Pin B Destination */}
                                <circle cx="700" cy="100" r="10" fill="white" stroke="hsl(var(--p))" strokeWidth="5" />
                                <path d="M700 100 L 700 80" stroke="hsl(var(--p))" strokeWidth="4" />
                                <circle cx="700" cy="70" r="14" fill="hsl(var(--p))" />
                                <text x="700" y="75" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">H</text>
                            </svg>
                            
                            <div className="absolute bottom-4 left-4 right-4 bg-base-100/90 backdrop-blur shadow-lg rounded-lg p-3 text-sm font-medium border border-base-200 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-success animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0z" /></svg>
                                    Delivery vehicle is 3 stops away
                                </div>
                                <span className="text-xs opacity-60">Phase C WebSocket placeholder</span>
                            </div>
                            
                            <style>{`
                                @keyframes dash { to { stroke-dashoffset: -16; } }
                                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
                                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                            `}</style>
                        </div>

                        {/* Detailed Timeline */}
                        <div className="pl-2">
                            <h3 className="font-bold text-lg mb-6">Tracking History</h3>
                            <ul className="steps steps-vertical w-full">
                                {events.map((event, idx) => (
                                    <li key={event.id || idx} className="step step-primary text-left">
                                        <div className="flex flex-col items-start text-left ml-4 mb-8">
                                            <div className="font-bold text-lg text-primary">{event.title}</div>
                                            <div className="text-base-content/70">{event.location}</div>
                                            <div className="text-xs font-mono mt-1 opacity-60">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackShipmentPage;
