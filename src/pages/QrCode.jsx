import React, { useEffect, useState } from 'react';
import { GrFilter } from "react-icons/gr";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaPlus } from 'react-icons/fa';
import Button from '@mui/material/Button';
import DynamicTable from '../component/DynamicTable';
import axios from 'axios';
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';

import AddQrCodeForm from '../component/QrCodes/AddQrCodeForm';
const QrCode = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'true', 'false'
  const [openAddDialog, setOpenAddDialog] = useState(false);




  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const fetchQrCodes = async (isUsed) => {
    setLoading(true);
    try {
      let url = 'https://thirdpartyy.runasp.net/api/QRCodes/GetQrCodes';
      
      // Only append the query parameter if filtering by true/false
      if (isUsed !== 'all') {
        url += `?isUsed=${isUsed}`;
      }

      const response = await axios.get(url);
      setQrCodes(response.data);
      console.log("Codes fetched successfully:", response.data);
    } catch (error) {
      setError(error);
      console.error("Error fetching Codes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrCodes(filter === 'all' ? undefined : filter === 'true');
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const columns = [
    {
      field: 'code',
      headerName: 'Code',
      minWidth: 200,
      sortable: true,
      renderCell: (row) => (
        <div style={{ fontWeight: 'bold' }}>{row.code}</div>
      )
    },
    {
      field: 'price',
      headerName: 'Value',
      minWidth: 200,
      sortable: true,
      renderCell: (row) => (
        <div style={{ fontWeight: 'bold' }}>{row.price}</div>
      )
    },
    {
      field: 'isUsed',
      headerName: 'Status',
      align: 'center',
      minWidth: 120,
      sortable: true,
      renderCell: (row) => (
        <div style={{
          color: row.isUsed ? '#1A843C' : '#c62828',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          {row.isUsed ? 'Used' : 'Unused'}
        </div>
      )
    }
  ];
   const handleQrCodeAdded = () => {
        handleCloseAddDialog();
        fetchQrCodes();
    }

  return (
    <div className='flex flex-col gap-5'>
      <h2 className='text-[50px] font-bold'>QR Codes</h2>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          <GrFilter className='text-[30px] text-black' />
          <span className='text-[20px] font-bold'>Filter</span>
          
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filter}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Used</MenuItem>
                <MenuItem value="false">Unused</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </div>
        
        <Button
          variant="contained"
          startIcon={<FaPlus />}
          sx={{
            backgroundColor: '#EFA61B',
            width: '190px',
            color: 'white',
            fontSize: '16px',
            '&:hover': { backgroundColor: '#d69519' },
            textTransform: 'none',
            padding: '8px 16px',
          }}
          onClick={handleOpenAddDialog}
        >
          Generate Code
        </Button>
      </div>

      <DynamicTable
        columns={columns}
        data={qrCodes}
        showActions={true}
        onRowClick={(row) => console.log('Row clicked:', row)}
        onEdit={(row) => console.log('Edit:', row)}
        onDelete={(row) => console.log('Delete:', row)}
        onView={(row) => console.log('View:', row)}
        selectable={false}
      />


          <Dialog
                            open={openAddDialog}
                            onClose={handleCloseAddDialog}
                            maxWidth="md"
                            fullWidth
                        >
                            <AddQrCodeForm 
                                onClose={handleCloseAddDialog}
                                onSuccess={handleQrCodeAdded}
                            />
                       </Dialog>
    </div>
  );
};

export default QrCode;