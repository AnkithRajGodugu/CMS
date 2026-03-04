import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/auth';

const CustomerList = () => {
  const { hasRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('firstName,asc');

  useEffect(() => {
    fetchCustomers();
  }, [page, sort]);

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/v1/sectors/customers/paged?page=${page}&size=10&sort=${sort}&search=${search}`
      );

      console.log("API RESPONSE:", res.data);

      setCustomers(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.error('Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const prev = customers;

    // optimistic update
    setCustomers(prev.filter(c => c.id !== id));

    try {
      await api.delete(`/v1/sectors/customers/${id}`);
    } catch (err) {
      setCustomers(prev);
    }
  };

  const handleBulkDelete = async () => {
    const prev = customers;

    setCustomers(prev.filter(c => !selected.includes(c.id)));

    try {
      await Promise.all(
        selected.map(id => api.delete(`/v1/sectors/customers/${id}`))
      );

      setSelected([]);

    } catch {
      setCustomers(prev);
    }
  };

  const exportCSV = () => {
    const csv = customers
      .map(c => `${c.firstName},${c.lastName},${c.email}`)
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>

        {hasRole('ADMIN') && (
          <button
            onClick={() => navigate('/customers/new')}
            className="btn btn-primary"
          >
            Add Customer
          </button>
        )}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-4 flex-wrap">

        <input
          className="input input-bordered"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-outline"
          onClick={() => {
            setPage(0);
            fetchCustomers();
          }}
        >
          Search
        </button>

        <select
          className="select select-bordered"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="firstName,asc">Name Asc</option>
          <option value="firstName,desc">Name Desc</option>
        </select>

        <button
          onClick={exportCSV}
          className="btn btn-outline"
        >
          Export CSV
        </button>

        {selected.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="btn btn-error"
          >
            Delete Selected
          </button>
        )}

      </div>

      {/* Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body overflow-x-auto">

          <table className="table table-zebra">

            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelected(
                        e.target.checked
                          ? customers.map(c => c.id)
                          : []
                      )
                    }
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map(c => (
                <tr key={c.id}>

                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(c.id)}
                      onChange={() =>
                        setSelected(prev =>
                          prev.includes(c.id)
                            ? prev.filter(id => id !== c.id)
                            : [...prev, c.id]
                        )
                      }
                    />
                  </td>

                  <td>
                    {c.firstName} {c.lastName}
                  </td>

                  <td>
                    {c.email}
                  </td>

                  <td className="flex gap-2">

                    <button
                      onClick={() => navigate(`/customers/${c.id}/edit`)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>

                    {hasRole('ADMIN') && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-3">

              <button
                disabled={page === 0}
                className="btn btn-sm"
                onClick={() => setPage(page - 1)}
              >
                Prev
              </button>

              <span>
                Page {page + 1} of {totalPages}
              </span>

              <button
                disabled={page + 1 === totalPages}
                className="btn btn-sm"
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>

            </div>
          )}

        </div>
      </div>

    </div>
  );
};

export default CustomerList;