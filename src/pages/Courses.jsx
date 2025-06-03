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
import AddCourseForm from '../component/courses/AddCourseForm';
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';

const Courses = () => {
    const [filter, setFilter] = useState('all');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);
    
    const handleFilterChange = (event) => {
        const value = event.target.value;
        setFilter(value);
        filterCourses(value);
    };

    const filterCourses = (status) => {
        if (status === 'all') {
            setFilteredCourses(courses);
        } else {
            const isActive = status === 'active';
            const filtered = courses.filter(course => course.isActive === isActive);
            setFilteredCourses(filtered);
        }
    };

    const handleOpenDeleteDialog = (course) => {
        setSelectedCourse(course);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedCourse(null);
    };

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
            field: 'images',
            headerName: 'Logo',
            minWidth: 100,
            renderCell: (row) => (
                <img 
                    src={`${'https://thirdpartyy.runasp.net/'}${row.imagePath}`} 
                    alt={`${row.name} logo`} 
                    style={{ 
                        width: 50, 
                        height: 50, 
                        objectFit: 'contain',
                        borderRadius: '4px'
                    }} 
                />
            )
        },
        {
            field: 'University',
            headerName: 'University',
            align: 'center',
            minWidth: 150,
            sortable: true,
            renderCell: (row) => (
                <div>
                    {row.universityName}
                </div>
            )
        },
        {
            field: 'doctors',
            headerName: 'Doctor',
            align: 'center',
            minWidth: 120,
            renderCell: (row) => (
                <div>
                    <span>{row.doctorName}</span>
                </div>
            )
        },
        {
            field: 'review',
            headerName: 'Review',
            align: 'center',
            minWidth: 120,
            renderCell: (row) => (
                <div>
                    <span>{row.rating}</span>
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

    const getAllCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10`);
            setCourses(response.data);
            setFilteredCourses(response.data);
            setLoading(false);
            console.log("Courses fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching courses:", error);
        }
    };

    const handleCourseAdded = () => {
        handleCloseAddDialog();
        getAllCourses();
    };

    const handleDeleteCourse = async () => {
        if (!selectedCourse) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`https://thirdpartyy.runasp.net/api/Courses/DeleteCourse/${selectedCourse.id}`);
            getAllCourses();
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Error deleting course:", error);
            setError("Failed to delete course");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        getAllCourses();
    }, []);

    if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading courses...</div>;
    }

    if (error) {
        return <div className='flex items-center justify-center text-[30px] text-red-500'>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col gap-5'>
            <h2 className='text-[50px] font-bold'>Courses</h2>
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
                                value={filter}
                                label="Status"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'white'
                                        }
                                    }
                                }}
                                size='small'
                                onChange={handleFilterChange}
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
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
                        Add Course
                    </Button>
                </div>
            </div>

            <div>
                <DynamicTable
                    columns={columns}
                    data={filteredCourses}
                    showActions={true}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => console.log('Edit:', row)}
                    onDelete={(row) => handleOpenDeleteDialog(row)}
                    onView={(row) => console.log('View:', row)}
                    selectable={false}
                />
            </div>

            <Dialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                maxWidth="md"
                fullWidth
            >
                <AddCourseForm 
                    onClose={handleCloseAddDialog}
                    onSuccess={handleCourseAdded}
                />
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                sx={{
                    '& .MuiDialog-paper': {
                        width: '600px',
                        maxWidth: '100%',
                    },
                }}
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: '36px', fontWeight: 'bold' }}>
                    Delete Course
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                        Are you sure you want to delete this course?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                    <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteCourse} 
                        color="error"
                        disabled={deleteLoading}
                        autoFocus
                        sx={{width: "192px", height: "50px", backgroundColor:"#F54135", color: "white", border:"1px solid #000" }}
                    >
                        {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Courses;