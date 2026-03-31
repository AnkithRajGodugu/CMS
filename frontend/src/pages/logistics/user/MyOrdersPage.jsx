import { useState, useEffect } from 'react';
import { getMyShipments } from '../../../services/logisticsService';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const [filter, setFilter] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await getMyShipments();
                if (res.data?.success) {
                    setOrders(res.data.data.content || []);
                }
            } catch (err) {
                console.error('Failed to fetch shipments/orders', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = filter === 'All' 
        ? orders 
        : orders.filter(o => 
            (filter === 'Delivered' && (o.status === 'DELIVERED' || o.status === 'delivered')) ||
            (filter === 'In Transit' && (o.status === 'IN_TRANSIT' || o.status === 'in_transit')) ||
            (filter === 'Processing' && (o.status === 'PENDING' || o.status === 'pending')) ||
            (filter === 'Cancelled' && (o.status === 'CANCELLED' || o.status === 'cancelled'))
        );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <p className="text-base-content/60">View order history and download invoices for your {orders.length} shipments.</p>
                </div>
                <button className="btn btn-outline btn-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export
                </button>
            </div>

            <div className="card bg-base-100 shadow-xl border border-base-200">
                <div className="card-body">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6 border-b pb-4 border-base-200">
                        {['All', 'Processing', 'In Transit', 'Delivered', 'Cancelled'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost border-base-300'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto w-full">
                        <table className="table table-zebra w-full text-left">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Route</th>
                                    <th>Weight</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((o) => (
                                    <tr key={o.id} className="hover">
                                        <td className="font-bold font-mono text-sm">ORD-{10000 + o.id}</td>
                                        <td className="text-base-content/70 text-sm whitespace-nowrap">
                                            {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className="text-xs text-base-content/70">From: {o.origin || 'Unknown'}</span>
                                                <span className="text-sm font-medium">To: {o.destination || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="font-medium">{o.weight ? `${o.weight} kg` : '-'}</td>
                                        <td>
                                            <span className={`badge badge-sm ${
                                                o.status === 'DELIVERED' ? 'badge-success badge-outline' :
                                                o.status === 'IN_TRANSIT' ? 'badge-warning badge-outline' :
                                                o.status === 'PENDING' ? 'badge-info bg-info/10 border-info/20' :
                                                'badge-ghost'
                                            }`}>
                                                {o.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="join">
                                                {o.trackingId && o.status !== 'DELIVERED' && (
                                                    <Link to={`/user/logistics/track?id=${o.trackingId}`} className="btn btn-xs join-item bg-primary/10 text-primary border-none hover:bg-primary/20">Track</Link>
                                                )}
                                                <button className="btn btn-ghost btn-xs join-item">Invoice</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {filteredOrders.length === 0 && (
                            <div className="text-center py-8 text-base-content/50">
                                No orders found matching "{filter}"
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
