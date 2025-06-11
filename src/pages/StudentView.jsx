import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DynamicTable from "../component/DynamicTable";
import Button from '@mui/material/Button';
import { GrFormView } from "react-icons/gr";
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';
import { FaPlus } from 'react-icons/fa';

const StudentView = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddCourseDialog, setOpenAddCourseDialog] = useState(false);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);
  const handleOpenAddCourseDialog = () => setOpenAddCourseDialog(true);
  const handleCloseAddCourseDialog = () => setOpenAddCourseDialog(false);


  useEffect(() => {
    const getStudentView = async () => {
      try {
        const response = await axios.get(
          `https://thirdpartyy.runasp.net/api/Students/GetStudent?id=${id}`
        );
         setStudent(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getStudentView();
  }, [id]);//

     const getMyCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Students/GetMyCourses?id=${id}`);
            setCourses(response.data);
            setLoading(false);
            console.log("Courses fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching courses:", error);
        }
    };


    const getAllCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10`);
            setAllCourses(response.data);
            setLoading(false);
            console.log("Courses fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching courses:", error);
        }
    };





useEffect(() => {
    getMyCourses();  
    getAllCourses()  
},[id])
const columnsCourses = [
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




   if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading doctor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

   const handleBuyCourse = async () => {
    if (!selectedCourse) {
      alert('Please select a course first');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        courseId: selectedCourse.id,
        studentId: id // using the id from useParams
      };

      await axios.post(
        'https://thirdpartyy.runasp.net/api/Students/BuyCourse',
        payload
      );

      // Refresh the course list after successful purchase
      await getMyCourses();
      handleCloseAddCourseDialog();
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error purchasing course:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex flex-col gap-5">
          <h2 className='text-[50px] font-bold'>Student / {student.name}</h2>
          <div className="flex gap-5 justify-end">
            <Button
              variant="contained"
              startIcon={<GrFormView />}
              sx={{
                backgroundColor: '#1A843C',
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
              View Id
            </Button>
              <Button
                variant="contained"
                startIcon={<FaPlus />}
                sx={{
                backgroundColor: '#1A843C',
                width: '190px',
                color: 'white',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#d69519', // slightly darker on hover
                },
                textTransform: 'none', // prevents uppercase transformation
                padding: '8px 16px', // adjust padding as needed
              }}
               onClick={handleOpenAddCourseDialog}
            >
              Add Course
            </Button>
          </div>
          <div className="w-full flex gap-5">
              <div className="w-1/3 flex flex-col gap-5">
                <div className="bg-white p-5 rounded-lg shadow-md flex items-center gap-5">
                  <div>
                      <img src={`https://thirdpartyy.runasp.net${student.image}`} alt="Student" className="w-32 h-32 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <span className="font-bold text-[16px]">{student.name}</span>
                      <span className="font-bold text-[16px] text-[#787878]">{student.universityName}</span>
                  </div>
                </div>

              </div>
            <div className="w-2/3 bg-white p-5 rounded-lg shadow-md">
                <h2 className='text-[40px] font-bold'>courses</h2>
                  <div>
                  <DynamicTable
                      columns={columnsCourses}
                      data={courses}
                      showActions={false}
                      onRowClick={(row) => console.log('Row clicked:', row)}
                      onEdit={(row) => console.log('Edit:', row)}
                      onDelete={(row) => handleOpenDeleteDialog(row)}
                      onView={(row) => console.log('View:', row)}
                      selectable={false}
                          />
                  </div>
              </div>

          </div>

              <Dialog
                          open={openAddDialog}
                          onClose={handleCloseAddDialog}
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
                               {student.name} - Image Id
                          </DialogTitle>
                          <DialogContent>
                              <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                <img src={`https://thirdpartyy.runasp.net${student.imageId}`} alt="Student" className="w-full h-full " />
                              </DialogContentText>
                          </DialogContent>
                  
              </Dialog>

              {/* Add course  */}

          <Dialog
    open={openAddCourseDialog}
    onClose={handleCloseAddCourseDialog}
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
      Select a course
    </DialogTitle>
    <DialogContent>
      <div className="flex flex-col gap-4 mt-4">
        <DialogContentText>
          Select a course to add to this student's enrollment:
        </DialogContentText>
        
        <div className="w-full">
          <select 
            className="w-full p-3 border border-gray-300 rounded-md"
            onChange={(e) => {
              const course = allCourses.find(c => c.id === parseInt(e.target.value));
              setSelectedCourse(course);
            }}
            value={selectedCourse?.id || ''}
          >
            <option value="">Select a course</option>
            {allCourses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseAddCourseDialog}>Cancel</Button>
      <Button 
        onClick={handleBuyCourse}
        disabled={!selectedCourse || loading}
        variant="contained"
        color="primary"
      >
        {loading ? 'Processing...' : 'Purchase Course'}
      </Button>
    </DialogActions>
  </Dialog>


    </div>
  )
}

export default StudentView