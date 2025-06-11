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
import AddLectureForm from '../component/lectures/AddLectureForm';
import EditLectureForm from '../component/lectures/EditLectureForm';
const Lectures = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [all, setAll] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    const handleOpenEditDialog = (lecture) => {
        setSelectedLecture(lecture);
        setOpenEditDialog(true);
    };
    
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedLecture(null);
    };

    const handleOpenDeleteDialog = (lecture) => {
        setSelectedLecture(lecture);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedLecture(null);
    };

    const handleChange = (event) => { 
         setSelectedCourse(event.target.value );
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10&universityId=1&isActive=false'
                );
                
                // Add console log to check API response structure
                console.log('API Response:', response.data);
                
                // Adjust based on actual API response
                const coursesData =  response.data || [];
                setAll(coursesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);


const getAllLectures = async () => {
    try{
      const response = await axios.get(`https://thirdpartyy.runasp.net/api/Lectures/GetLectures?courseId=${selectedCourse}`);
      setLectures(response.data);
      setLoading(false);
      console.log("lectures fetched successfully:", response.data);
    }catch (error) {
      setLoading(false);
      console.error("Error fetching lectures:", error);
    }
}
   const handleLectureAdded = () => {
        handleCloseAddDialog();
        getAllLectures();
    }

        
    const handleLectureUpdated = () => {
        handleCloseEditDialog();
        getAllLectures();
    }

  useEffect(() => {
    if (selectedCourse) {
        getAllLectures();
    }
},[selectedCourse])

      const handleDeleteLecture = async () => {
        if (!selectedLecture) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`https://thirdpartyy.runasp.net/api/Lectures/DeleteLecture/${selectedLecture.id}`);
            getAllLectures(); // Refresh the list
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Error deleting university:", error);
            setError("Failed to delete university");
        } finally {
            setDeleteLoading(false);
        }
    }


//get lectures columns

const columns = [
  {
    field: 'name',
    headerName: ' Name',
    minWidth: 200,
    sortable: true,
    renderCell: (row) => (
      <div style={{ fontWeight: 'bold' }}>
        {row.title}
      </div>
    )
  },
  
  {
    field: 'courses',
    headerName: 'Courses',
     align: 'center',
    minWidth: 150,
    sortable: true,
    renderCell: (row) => (
      <div >
        {row.courseName || `Course ${row.courseId}`}
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
        <span>{row.chapters}</span>
      </div>
    )
  },
  {
    field: 'type',
    headerName: 'Type',
    align: 'center',
    minWidth: 120,
    renderCell: (row) => (
      <div>
        <span>{row.Type}</span>
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




  return (
    <div className='flex flex-col gap-5'>
        <h2 className='text-[50px] font-bold'>Lectures</h2>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
                <GrFilter className='text-[30px] text-black' />
                <span className='text-[20px] font-bold'>Filter</span>
                 <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">courses</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCourse}
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
                     {all?.map((course) => (
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
      backgroundColor: '#d69519', // slightly darker on hover
    },
    textTransform: 'none', // prevents uppercase transformation
    padding: '8px 16px', // adjust padding as needed
  }}
   onClick={handleOpenAddDialog}
>
 Add Lecture
</Button>
            </div>
        </div>

        
                <div>
                  <DynamicTable
                    columns={columns}
                    data={lectures}
                    showActions={true}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => handleOpenEditDialog(row)}
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
                      <AddLectureForm 
                          onClose={handleCloseAddDialog}
                          onSuccess={handleLectureAdded}
                      />
                 </Dialog>
                    <Dialog
                        open={openEditDialog}
                        onClose={handleCloseEditDialog}
                        maxWidth="md"
                        fullWidth
                             >
                          {selectedLecture && (
                              <EditLectureForm 
                                  lecture={selectedLecture}
                                  onClose={handleCloseEditDialog}
                                  onSuccess={handleLectureUpdated}
                              />
                          )}
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
                                            Delete Lecture
                                      </DialogTitle>
                                      <DialogContent>
                                          <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                             Are you sure deleting this Lecture?
                                          </DialogContentText>
                                      </DialogContent>
                                      <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                                          <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                                              Cancel
                                          </Button>
                                          <Button 
                                              onClick={handleDeleteLecture} 
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

export default Lectures