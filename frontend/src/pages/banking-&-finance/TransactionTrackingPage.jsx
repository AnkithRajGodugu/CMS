import { useEffect, useState } from "react";
import { getTransactions } from "../../services/transactionService";
//import SectorLayout from '../../components/shared/SectorLayout';

const TransactionTrackingPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            // Handle both Spring Page objects (res.data.content) and raw arrays
            const transactionData = res.data?.content || res.data || [];
            setTransactions(Array.isArray(transactionData) ? transactionData : []);
        } catch (err) {
            console.error("Failed to load transactions", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = transactions.filter((t) =>
        t.customerName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        //<SectorLayout sector={{ code: 'banking' }}>
            //<div className="space-y-6">
        <div className="p-6 space-y-6">

            <h1 className="text-3xl font-bold">Transactions</h1>

            {/* Search */}
            <input
                type="text"
                placeholder="Search customer..."
                className="input input-bordered w-full max-w-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra">

                    <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Type</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4">Loading...</td>
                        </tr>
                    ) : filtered.length === 0 ? (
                        <tr>
                            <td colSpan="4">No transactions found</td>
                        </tr>
                    ) : (
                        filtered.map((t) => (
                            <tr key={t.id}>
                                <td>{t.customerName}</td>
                                <td>${t.amount}</td>
                                <td>{t.type}</td>
                                <td>
                    <span
                        className={`badge ${
                            t.status === "COMPLETED"
                                ? "badge-success"
                                : t.status === "PENDING"
                                    ? "badge-warning"
                                    : "badge-error"
                        }`}
                    >
                      {t.status}
                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>

                </table>
            </div>
        </div>
// </div>
// </SectorLayout>
    );
};

export default TransactionTrackingPage;
