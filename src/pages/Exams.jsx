import React, { useState, useEffect } from 'react';
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
import AddExamForm from '../component/Exams/AddExamForm';
import {useNavigate} from 'react-router-dom';

const Exams = () => {
    const [filterStatus, setFilterStatus] = useState('all');
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const navigate = useNavigate();
    
    
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    const handleChange = (event) => { 
        setAll(event.target.value );
    };
    // Table columns configuration
    const columns = [
        {
            field: 'name',
            headerName: 'University Name',
            minWidth: 200,
            sortable: true,
            renderCell: (row) => (
                <div style={{ fontWeight: 'bold' }}>
                    {row.title}
                </div>
            )
        },
        {
            field: 'course',
            headerName: 'Course',
            align: 'center',
            minWidth: 150,
            sortable: true,
            renderCell: (row) => (
                <div>
                    {row.courseName}
                </div>
            )
        },
        {
            field: 'chapter',
            headerName: 'Chapter',
            align: 'center',
            minWidth: 120,
            renderCell: (row) => (
                <div>
                    {/* Placeholder for chapter data */}
                </div>
            )
        },
        {
            field: 'isActive',
            headerName: 'Status',
            align: 'center',
            minWidth: 120,
            sortable: true,
            renderCell: (row) => (
                <div style={{
                    color: row.isActive ? '#1A843C' : '#c62828',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    {row.isActive ? 'Active' : 'Inactive'}
                </div>
            )
        }
    ];

    // Fetch exams data
    const getAllExams = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Exams/GetExams`);
            setExams(response.data);
            setFilteredExams(response.data); // Initialize filtered exams with all data
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleExamAdded = () => {
        handleCloseAddDialog();
        getAllExams();
    };  

    // Apply filter based on status
    
    const applyFilter = () => {
        if (filterStatus === 'all') {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(exam => 
                filterStatus === 'active' ? exam.isActive : !exam.isActive
            );
            setFilteredExams(filtered);
        }
    };

    // Handle filter change
    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
    };

    // Load data and apply filters when they change
    useEffect(() => {
        getAllExams();
    }, []);

    useEffect(() => {
        if (exams.length > 0) {
            applyFilter();
        }
    }, [filterStatus, exams]);

    if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading exams...</div>;
    }

    if (error) {
        return <div className='flex items-center justify-center text-[30px] text-red-500'>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col gap-5'>
            <h2 className='text-[50px] font-bold'>Exams</h2>
            
            {/* Filter Section */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-8'>
                    <GrFilter className='text-[30px] text-black' />
                    <span className='text-[20px] font-bold'>Filter</span>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="status-filter-label">Status</InputLabel>
                            <Select
                                labelId="status-filter-label"
                                id="status-filter"
                                value={filterStatus}
                                label="Status"
                                onChange={handleFilterChange}
                                size='small'
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active Only</MenuItem>
                                <MenuItem value="inactive">Inactive Only</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                
                {/* Add Exam Button */}
                <div>
                    <Button
                        variant="contained"
                        startIcon={<FaPlus />}
                        sx={{
                            backgroundColor: '#EFA61B',
                            width: '190px',
                            color: 'white',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: '#d69519',
                            },
                            textTransform: 'none',
                            padding: '8px 16px',
                        }}
                     onClick={handleOpenAddDialog}
                    >
                        Add Exam
                    </Button>
                </div>
            </div>

            {/* Exams Table */}
            <div>
                <DynamicTable
                    columns={columns}
                    data={filteredExams}
                    showActions={true}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => console.log('Edit:', row)}
                    onDelete={(row) => console.log('Delete:', row)}
                    onView={(row) => navigate(`/exam/${row.id}`)}
                    selectable={false}
                />
            </div>
               <Dialog
                                  open={openAddDialog}
                                  onClose={handleCloseAddDialog}
                                  maxWidth="md"
                                  fullWidth
                              >
                                  <AddExamForm 
                                      onClose={handleCloseAddDialog}
                                      onSuccess={handleExamAdded}
                                  />
                             </Dialog>
        </div>
    );
};

export default Exams;