import { useEffect, useState } from 'react';
import { getCustomers } from '../../services/customerService';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ReportExportButtons from '../../components/shared/ReportExportButtons';

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchCustomers = async () => {
        try {
            setLoading(true);

            const response = await getCustomers(page, 5);

            console.log("CUSTOMERS API:", response.data);

            setCustomers(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (err) {
            console.error("Error fetching customers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [page]);

    return (
        <div className="min-h-screen bg-base-200">
            <Header />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Customers</h1>
                    <ReportExportButtons sectorCode="BANKING" />
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        <table className="table w-full bg-white shadow">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.firstName} {c.lastName}</td>
                                    <td>{c.email}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* 🔥 PAGINATION */}
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                className="btn"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                Prev
                            </button>

                            <span>Page {page + 1} of {totalPages}</span>

                            <button
                                className="btn"
                                disabled={page + 1 >= totalPages}
                                onClick={() => setPage(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CustomersPage;