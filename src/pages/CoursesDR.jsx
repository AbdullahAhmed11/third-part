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
import {useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


const CoursesDR = () => {
    const navigate = useNavigate();
    const getUserInfo = () => {
    const token = Cookies.get('token');
      if (!token) return null;
    
      try {
        const decoded = jwtDecode(token);
    
        const name = decoded.Name;
        const id = decoded.Id;
        const role = decoded.Role;
        const image = decoded.Image;
    
        return { name, id, role, image };
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    };

    
    const user = getUserInfo();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const handleOpenDeleteDialog = (course) => {
        setSelectedCourse(course);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedCourse(null);
    };
    const getAllCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetDoctorCourses?id=${user?.id}`);
            setCourses(response.data);
            setLoading(false);
            console.log("Courses fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching courses:", error);
        }
    };
    
    useEffect(() => {
        getAllCourses()
    },[])
const columns = [
        {
            field: 'name',
            headerName: 'Name',
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
    ]


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
  return (
    <div className='flex flex-col gap-5'>
        <h2 className='text-[50px] font-bold'>Courses</h2>
       
                   <div>
                       <DynamicTable
                           columns={columns}
                           data={courses}
                           showActions={true}
                           onRowClick={(row) => console.log('Row clicked:', row)}
                        //    onEdit={(row) => console.log('Edit:', row)}
                           onDelete={(row) => handleOpenDeleteDialog(row)}
                           onView={(row) => navigate(`/course/${row.id}`)}
                           selectable={false}
                       />
                   </div>
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
  )
}

export default CoursesDR