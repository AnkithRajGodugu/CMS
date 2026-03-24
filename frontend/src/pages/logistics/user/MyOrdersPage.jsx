import { useState } from 'react';

const MyOrdersPage = () => {
    const [filter, setFilter] = useState('All');

    const orders = [
        { id: 'ORD-10029', date: 'Oct 24, 2023', items: '2 Pallets Electronics', total: '$4,500.00', status: 'In Transit', tracking: 'TRK-9824-771X' },
        { id: 'ORD-10028', date: 'Oct 20, 2023', items: 'Office Supplies', total: '$350.50', status: 'Processing', tracking: null },
        { id: 'ORD-10027', date: 'Oct 15, 2023', items: '1 Pallet Raw Materials', total: '$1,200.00', status: 'Delivered', tracking: 'TRK-5510-993A' },
        { id: 'ORD-10026', date: 'Oct 05, 2023', items: 'Marketing Materials', total: '$850.00', status: 'Delivered', tracking: 'TRK-1122-334B' },
        { id: 'ORD-10025', date: 'Sep 28, 2023', items: 'IT Equipment', total: '$8,240.00', status: 'Delivered', tracking: 'TRK-9988-776C' },
    ];

    const filteredOrders = filter === 'All' 
        ? orders 
        : orders.filter(o => o.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Orders</h1>
                    <p className="text-base-content/60">View order history and download invoices.</p>
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
                                    <th>Items Summary</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((o) => (
                                    <tr key={o.id} className="hover">
                                        <td className="font-bold font-mono text-sm">{o.id}</td>
                                        <td className="text-base-content/70 text-sm whitespace-nowrap">{o.date}</td>
                                        <td>{o.items}</td>
                                        <td className="font-medium">{o.total}</td>
                                        <td>
                                            <span className={`badge badge-sm ${
                                                o.status === 'Delivered' ? 'badge-success badge-outline' :
                                                o.status === 'In Transit' ? 'badge-warning badge-outline' :
                                                o.status === 'Processing' ? 'badge-info bg-info/10 border-info/20' :
                                                'badge-ghost'
                                            }`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <div className="join">
                                                {o.tracking && o.status !== 'Delivered' && (
                                                    <a href={`/user/logistics/track?id=${o.tracking}`} className="btn btn-xs join-item bg-primary/10 text-primary border-none hover:bg-primary/20">Track</a>
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
