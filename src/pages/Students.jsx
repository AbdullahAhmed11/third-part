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
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';
import EditStudentForm from '../component/students/EditStudentForm';
import AddStudentForm from '../component/students/AddStudentForm';
import { useNavigate } from 'react-router-dom';
const Students = () => {
    const navigate = useNavigate();
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
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);



    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

  
    const handleOpenEditDialog = (student) => {
            setSelectedStudent(student);
            setOpenEditDialog(true);
        };
        
    const handleCloseEditDialog = () => {
            setOpenEditDialog(false);
            setSelectedStudent(null);
        };
    const handleOpenDeleteDialog = (student) => {
        setSelectedStudent(student);
        setOpenDeleteDialog(true);
        };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedStudent(null);
        };


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
                    'https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=20'
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


    const handleStudentsAdded = () => {
        handleCloseAddDialog();
        getAllStudents();
    }
    const handleStudentUpdated = () => {
        handleCloseEditDialog();
        getAllStudents();
    }

    useEffect(() => {
        getAllStudents();
    }, []);



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

   const handleDeleteStudent = async () => {
            if (!selectedStudent) return;
            
            setDeleteLoading(true);
            try {
                await axios.delete(`https://thirdpartyy.runasp.net/api/Students/DeleteStudent?id=${selectedStudent.id}`);
                getAllStudents(); 
                handleCloseDeleteDialog();
            } catch (error) {
                console.error("Error deleting Doctors:", error);
                setError("Failed to delete Doctors");
            } finally {
                setDeleteLoading(false);
            }
        }
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
                                        {course.title || `Course ${course.id}`}
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
                        onClick={handleOpenAddDialog}
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
                    // pagination={pagination}
                    onPageChange={handlePageChange}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => handleOpenEditDialog(row)}
                    onDelete={(row) => handleOpenDeleteDialog(row)}                   
                     onView={(row) => navigate(`/student/${row.id}`)}
                    selectable={false}
                />
            </div>

                <Dialog
                open={openAddDialog}
                onClose={handleCloseAddDialog}
                maxWidth="md"
                fullWidth
                >
                    <AddStudentForm 
                        onClose={handleCloseAddDialog}
                        onSuccess={handleStudentsAdded}
                    />
                </Dialog>

                <Dialog 
                    open={openEditDialog}
                    onClose={handleCloseEditDialog}
                    maxWidth="md"
                    fullWidth
                >
                    {
                    selectedStudent && (
                    <EditStudentForm
                        student={selectedStudent}
                        onClose={handleCloseEditDialog}
                        onSuccess={handleStudentUpdated}
                    />
                    )
                    }
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
                                                    Delete Student
                                              </DialogTitle>
                                              <DialogContent>
                                                  <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                                      Are you sure deleting this Student?
                                                  </DialogContentText>
                                              </DialogContent>
                                              <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                                                  <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                                                      Cancel
                                                  </Button>
                                                  <Button 
                                                      onClick={handleDeleteStudent} 
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
    )
}

export default Students;