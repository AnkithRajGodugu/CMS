import React from 'react';
import { Download, FileSpreadsheet, FileText, FileUp } from 'lucide-react';
import BulkImportButton from './BulkImportButton';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const ReportExportButtons = ({ sectorCode }) => {
  const handleExport = (type) => {
    const url = `${API_BASE}/api/reports/customers/${type}?sectorCode=${sectorCode}`;
    const token = localStorage.getItem('token');
    
    // For simple file downloads with auth, we can use a temporary link or a fetch with blob
    // However, window.open doesn't send the Authorization header.
    // So we'll fetch as blob and create a URL.
    
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Export failed');
      return response.blob();
    })
    .then(blob => {
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `customers_${sectorCode}.${type === 'excel' ? 'xlsx' : 'pdf'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    })
    .catch(err => {
      console.error('Export error:', err);
      alert('Failed to export report. Please try again.');
    });
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      <button 
        onClick={() => handleExport('excel')}
        className="btn btn-outline btn-success btn-xs sm:btn-sm gap-1 sm:gap-2"
        title="Export to Excel"
      >
        <FileSpreadsheet size={14} />
        <span className="hidden sm:inline">Excel</span>
      </button>
      
      <button 
        onClick={() => handleExport('pdf')}
        className="btn btn-outline btn-error btn-xs sm:btn-sm gap-1 sm:gap-2"
        title="Export to PDF"
      >
        <FileText size={14} />
        <span className="hidden sm:inline">PDF</span>
      </button>

      <div className="hidden sm:flex divider divider-horizontal mx-0" />

      <BulkImportButton onComplete={() => window.location.reload()} />
    </div>
  );
};

export default ReportExportButtons;
