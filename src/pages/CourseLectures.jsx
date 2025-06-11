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
import { useParams } from "react-router-dom";
import AddCourseLectureForm from '../component/CourseLecture/AddCourseLectureForm';
const CourseLectures = () => {
    const [all, setAll] = React.useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);




    const { id } = useParams(); // Get ID from URL params
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getLectureAndLessons = async () => {
      try {
        const response = await axios.get(
          `https://thirdpartyy.runasp.net/api/Lectures/GetLecturesAndLessons?courseId=${id}`
        );
         setLectures(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    getLectureAndLessons();
  }, [id]);

        if (loading) {
            return <div className='flex items-center justify-center text-[30px]'>Loading lectures...</div>;
        }
    
        if (error) {
            return <div>Error: {error}</div>;
        }
    const handleChange = (event) => { 
        setAll(event.target.value );
    };



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
    field: 'No',
    headerName: 'No',
    // align: 'center',
    minWidth: 100,
        renderCell: (row) => (
      <div style={{ fontWeight: 'bold' }}>
        {row.chapters}
      </div>
    )
  },
  {
    field: 'material',
    headerName: 'Material',
     align: 'center',
    minWidth: 150,
    sortable: true,
    renderCell: (row) => (
      <div >
        {row.material}
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
   const handleUniversityAdded = () => {
        handleCloseAddDialog();
        getLectureAndLessons();
    }
  return (
    <div className="flex flex-col gap-5">
        <h2 className='text-[50px] font-bold'>Course </h2>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-8'>
                <GrFilter className='text-[30px] text-black' />
                <span className='text-[20px] font-bold'>Filter</span>
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
 Add Chapter
</Button>
            </div>
        </div>
        <div>
            <DynamicTable
            columns={columns}
            data={lectures}
            showActions={false}
            onRowClick={(row) => console.log('Row clicked:', row)}
            onEdit={(row) => console.log('Row clicked:', row)}
            onDelete={(row) => console.log('Row clicked:', row)}
            onView={(row) => console.log('View:', row)}
            showNotActive={true}
            onNotActive={(row) => console.log('Marked as not active:', row)}
            selectable={false} // Set to true if you want to enable row selection
            />
        </div>
        
                 <Dialog
                        open={openAddDialog}
                        onClose={handleCloseAddDialog}
                        maxWidth="md"
                        fullWidth
                    >
                        <AddCourseLectureForm 
                            onClose={handleCloseAddDialog}
                            onSuccess={handleUniversityAdded}
                        />
                    </Dialog>
    </div>
  )
}

export default CourseLectures