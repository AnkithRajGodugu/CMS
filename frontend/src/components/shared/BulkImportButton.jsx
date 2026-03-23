import React, { useRef, useState } from 'react';
import { Upload, Loader2, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';

const BulkImportButton = ({ onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls') {
      toast.error('Invalid file type. Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/customers/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success(`Successfully imported ${response.data.count} customers`);
        if (onComplete) onComplete();
      } else {
        toast.error(response.data.message || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error(error.userMessage || 'An error occurred during import');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx, .xls"
        className="hidden"
      />
      
      <button
        onClick={triggerFileInput}
        disabled={uploading}
        className={`btn btn-outline btn-primary btn-sm gap-2 ${uploading ? 'loading' : ''}`}
        title="Import customers from Excel"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileUp size={16} />
        )}
        Excel Import
      </button>
    </>
  );
};

export default BulkImportButton;
