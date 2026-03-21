import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search
} from 'lucide-react';

/**
 * DataTable - Reusable table component with sorting, filtering, and pagination
 * @param {Array} data - Array of data objects to display
 * @param {Array} columns - Column configuration [{key, label, sortable, render}]
 * @param {Number} pageSize - Number of rows per page (default: 10)
 * @param {Boolean} searchable - Enable search functionality (default: true)
 */
const DataTable = ({ 
  data = [], 
  columns = [], 
  pageSize = 10,
  searchable = true,
  loading = false,
  className = '',
  serverSide = false, // If true, internal sorting/filtering/pagination is disabled
  totalItems = 0,     // Required for serverSide pagination
  onPageChange,       // (page) => void
  onSortChange,       // (key, direction) => void
  onSearchChange,     // (term) => void
  currentPage: externalPage,
  sortConfig: externalSort,
}) => {
  const [internalPage, setInternalPage] = useState(1);
  const [internalSort, setInternalSort] = useState({ key: null, direction: null });
  const [internalSearch, setInternalSearch] = useState('');

  const currentPage = serverSide ? (externalPage || 1) : internalPage;
  const sortConfig = serverSide ? (externalSort || { key: null, direction: null }) : internalSort;
  const searchTerm = serverSide ? '' : internalSearch; // Server side search usually handled by parent

  // Filter data based on search term (CLIENT SIDE ONLY)
  const filteredData = useMemo(() => {
    if (serverSide || !searchTerm) return data;
    
    return data.filter(row =>
      columns.some(column => {
        const value = row[column.key];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns, serverSide]);

  // Sort data (CLIENT SIDE ONLY)
  const sortedData = useMemo(() => {
    if (serverSide || !sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig, serverSide]);

  // Paginate data (CLIENT SIDE ONLY)
  const paginatedData = useMemo(() => {
    if (serverSide) return data; // Data arrive already paginated
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [data, sortedData, currentPage, pageSize, serverSide]);

  const totalPages = serverSide 
    ? Math.ceil(totalItems / pageSize) 
    : Math.ceil(sortedData.length / pageSize);

  const handlePageChange = (newPage) => {
    if (serverSide) {
      onPageChange?.(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    if (serverSide) {
      onSortChange?.(key, direction);
    } else {
      setInternalSort({ key, direction });
    }
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search..."
              value={serverSide ? '' : searchTerm} // Search usually separate in serverSide
              onChange={(e) => {
                if (serverSide) {
                  onSearchChange?.(e.target.value);
                } else {
                  setInternalSearch(e.target.value);
                  setInternalPage(1);
                }
              }}
              className="input input-bordered w-full pl-10"
              aria-label="Search table"
            />
          </div>
          <div className="text-sm text-base-content/60">
            {serverSide ? totalItems : sortedData.length} { (serverSide ? totalItems : sortedData.length) === 1 ? 'result' : 'results'}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className={column.sortable !== false ? 'cursor-pointer select-none' : ''}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-10">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-base-content/60">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover">
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render 
                        ? column.render(row[column.key], row) 
                        : row[column.key]
                      }
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-base-content/60">
            Page {currentPage} of {totalPages}
          </div>
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              // Show first, last, current, and adjacent pages
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`join-item btn btn-sm ${currentPage === page ? 'btn-active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="join-item btn btn-sm btn-disabled">...</span>;
              }
              return null;
            })}
            <button
              className="join-item btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
