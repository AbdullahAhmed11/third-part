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
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import AddArticleForm from '../component/Articles/AddArticleForm';
const Articles = () => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [all, setAll] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [articles, setArticles] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        size: 10,
        total: 0
    });
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null)
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

   const handleOpenDeleteDialog = (article) => {
        setSelectedArticle(article);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedArticle(null);
    };

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
    console.log(user.id)
    const fetchArticles = async () => {
        if (!selectedCourse || !user?.id) return;
        
        try {
            setLoading(true);
            const endpoint = user.role === 'Doctor' ?
              `https://thiredparty.runasp.net/api/Articles/GetArticles?courseId=${selectedCourse}&doctorId=${user?.id}&page=1&size=10` :
               `https://thiredparty.runasp.net/api/Articles/GetArticles?courseId=${selectedCourse}&page=1&size=10` 

            const response = await axios.get(endpoint);
            
            console.log('Articles response:', response.data);
            setArticles(response.data || []);
            setPagination(prev => ({
                ...prev,
                total: response.data.totalCount || 0
            }));
        } catch (err) {
            console.error('Error fetching articles:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const endpoint = user.role === 'Doctor'
                ? `https://thiredparty.runasp.net/api/Courses/GetCourses?page=1&size=20&doctorId=${user.id}`
                : `https://thiredparty.runasp.net/api/Courses/GetCourses?page=1&size=20`;

            const response = await axios.get(endpoint);
            console.log('Courses response:', response.data);
            setAll(response.data || []);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => { 
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse && user?.id) {
            fetchArticles();
        }
    }, [selectedCourse, user?.id,]);
   const handleArticlesAdded = () => {
        handleCloseAddDialog();
        fetchArticles();
    }
  const columns = [
        {
            field: 'articleName',
            headerName: 'Name',
            minWidth: 200,
            sortable: true,
            renderCell: (row) => (
                <div style={{ fontWeight: 'bold' }}>
                    {row.articleName}
                </div>
            )
        },
        {
            field: 'courseName',
            headerName: 'Courses',
            align: 'center',
            minWidth: 150,
            sortable: true,
            renderCell: (row) => (
                <div>
                    {row.courseName || `Course ${row.courseId}`}
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

      const handleDeleteArticle = async () => {
        if (!selectedArticle) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`https://thiredparty.runasp.net/api/Articles/DeleteArticle/${selectedArticle.id}`);
            fetchArticles(); // Refresh the list
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Error deleting Article:", error);
            setError("Failed to delete Article");
        } finally {
            setDeleteLoading(false);
        }
    }
    return (
        <div className='flex flex-col gap-5'>
            <h2 className='text-[50px] font-bold'>Articles</h2>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-8'>
                    <GrFilter className='text-[30px] text-black' />
                    <span className='text-[20px] font-bold'>Filter</span>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="course-select-label">Courses</InputLabel>
                            <Select
                                labelId="course-select-label"
                                id="course-select"
                                value={selectedCourse}
                                label="Courses"
                                MenuProps={{
                                    PaperProps: {
                                        sx: { backgroundColor: 'white' }
                                    }
                                }}
                                size='small'
                                onChange={handleChange}
                            >
                                {all?.map((course) => (
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
                            '&:hover': { backgroundColor: '#d69519' },
                            textTransform: 'none',
                            padding: '8px 16px',
                        }}
                           onClick={handleOpenAddDialog}
                    >
                        Add Article
                    </Button>
                </div>
            </div>
            
            {/* Dynamic Table */}
        
                <div>
                  <DynamicTable
                    columns={columns}
                    data={articles}
                    showActions={true}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    // onEdit={(row) => console.log(row)}
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
                          <AddArticleForm 
                              onClose={handleCloseAddDialog}
                              onSuccess={handleArticlesAdded}
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
                                                                             Delete Articles
                                                                       </DialogTitle>
                                                                       <DialogContent>
                                                                           <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                                                              Are you sure deleting this Articles?
                                                                           </DialogContentText>
                                                                       </DialogContent>
                                                                       <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                                                                           <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                                                                               Cancel
                                                                           </Button>
                                                                           <Button 
                                                                               onClick={handleDeleteArticle} 
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

export default Articles;