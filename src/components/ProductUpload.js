import React, { useState } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Paper,
  CircularProgress
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProductUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('products', file);

    setUploading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(`File processed successfully! ${response.data.processedCount} products updated.`);
      if (response.data.errorCount > 0) {
        toast.warning(`${response.data.errorCount} errors encountered. Check console for details.`);
        console.log('Upload errors:', response.data.errors);
      }

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error uploading file');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload Products CSV
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload CSV'}
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileUpload}
          />
        </Button>
        <Typography variant="body2" color="textSecondary">
          Only CSV files are supported
        </Typography>
      </Box>
    </Paper>
  );
};

export default ProductUpload; 