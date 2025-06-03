import React, { useEffect, useState } from 'react'
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

const Students = () => {
    const [all, setAll] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0
    });

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            sortable: true,
            renderCell: (row) => (
                <div style={{ fontWeight: 'bold' }}>
                    {row.name}
                </div>
            )
        },
        {
            field: 'images',
            headerName: 'Image',
            minWidth: 100,
            renderCell: (row) => (
                <img 
                    src={`${'https://thirdpartyy.runasp.net/'}${row.image}`} 
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
            field: 'university',
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
            field: 'courses',
            headerName: 'Courses',
            align: 'center',
            minWidth: 120,
            renderCell: (row) => (
                <div>
                    <span>{row.courses}</span>
                </div>
            )
        },
        {
            field: 'grades',
            headerName: 'Grades',
            align: 'center',
            minWidth: 120,
            renderCell: (row) => (
                <div>
                    <span>{row.grades}</span>
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

    const handleCourseChange = (event) => { 
        setSelectedCourse(event.target.value);
        getAllStudents(event.target.value);
    };

    const handleChange = (event) => { 
        setAll(event.target.value);
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({...prev, page: newPage}));
        getAllStudents(selectedCourse, newPage);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10&universityId=1&isActive=false'
                );
                
                const coursesData = response.data || [];
                setAllCourses(coursesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const getAllStudents = async (courseId = '', page = 1) => {
        try {
            setLoading(true);
            let url = `https://thirdpartyy.runasp.net/api/Students/GetStudents?page=${page}&size=${pagination.size}`;
            
            if (courseId) {
                url += `&courseId=${courseId}`;
            }
            
            const response = await axios.get(url);
            setStudents(response.data.items || response.data); // Adjust based on your API response structure
            setPagination(prev => ({
                ...prev,
                total: response.data.totalCount || 0,
                page: page
            }));
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(error.message);
            console.error("Error fetching students:", error);
        }
    }
    
    useEffect(() => {
        getAllStudents();
    }, []);

    if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading...</div>;
    }

    if (error) {
        return <div className='flex items-center justify-center text-[30px] text-red-500'>Error: {error}</div>;
    }

    return (
        <div className='flex flex-col gap-5 p-4'>
            <h2 className='text-4xl font-bold'>Students</h2>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-8'>
                    <GrFilter className='text-[30px] text-black' />
                    <span className='text-xl font-bold'>Filter</span>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={all}
                                label="Age"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'white'
                                        }
                                    }
                                }}
                                size='small'
                                onChange={handleChange}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ minWidth: 200 }}>
                        <FormControl fullWidth>
                            <InputLabel id="course-select-label">Courses</InputLabel>
                            <Select
                                labelId="course-select-label"
                                id="course-select"
                                value={selectedCourse}
                                label="Courses"
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: 'white'
                                        }
                                    }
                                }}
                                size='small'
                                onChange={handleCourseChange}
                            >
                                <MenuItem value="">All Courses</MenuItem>
                                {allCourses?.map((course) => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.name || `Course ${course.id}`}
                                    </MenuItem>
                                ))}
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
                    >
                        Add Student
                    </Button>
                </div>
            </div>
            
            <div className='mt-4'>
                <DynamicTable
                    columns={columns}
                    data={students}
                    showActions={true}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => console.log('Edit:', row)}
                    onDelete={(row) => console.log('Delete:', row)}
                    onView={(row) => console.log('View:', row)}
                    selectable={false}
                />
            </div>
        </div>
    )
}

export default Students;