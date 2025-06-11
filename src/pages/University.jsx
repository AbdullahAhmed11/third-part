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
import AddUniversityForm from '../component/university/AddUniversityForm';
import EditUniversityForm from '../component/university/EditUniversityForm';
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';

// import Dialog from '@mui/material/Dialog';

const University = () => {
    const [all, setAll] = React.useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
     
    // Toggle add university dialog
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    const handleOpenEditDialog = (university) => {
        setSelectedUniversity(university);
        setOpenEditDialog(true);
    };
    
    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedUniversity(null);
    };

    const handleOpenDeleteDialog = (university) => {
        setSelectedUniversity(university);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUniversity(null);
    };

    const handleChange = (event) => { 
        setAll(event.target.value );
    };

    //implelemnt table
    const [universities, setUniversities] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

const columns = [
  {
    field: 'name',
    headerName: 'University Name',
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
    headerName: 'Logo',
    // align: 'center',
    minWidth: 100,
    renderCell: (row) => (
      <img 
        src={`${`https://thirdpartyy.runasp.net/`}${row.imagePath}`} 
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
    field: 'category',
    headerName: 'Category',
     align: 'center',
    minWidth: 150,
    sortable: true,
    renderCell: (row) => (
      <div >
        {row.category}
      </div>
    )
  },
  {
    field: 'doctors',
    headerName: 'Doctors',
    align: 'center',
    minWidth: 120,
    renderCell: (row) => (
      <div>
        <span>{row.doctors}</span>
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


//get university


const getAllUniversity = async () => {
    try{
      const response = await axios.get(`https://thirdpartyy.runasp.net/api/Universities/GetUniversities`);
      setUniversities(response.data);
      setLoading(false);
      console.log("Universities fetched successfully:", response.data);
    }catch (error) {
      setLoading(false);
      console.error("Error fetching universities:", error);
    }
}
   const handleUniversityAdded = () => {
        handleCloseAddDialog();
        getAllUniversity();
    }

      const handleDeleteUniversity = async () => {
        if (!selectedUniversity) return;
        
        setDeleteLoading(true);
        try {
            await axios.delete(`https://thirdpartyy.runasp.net/api/Universities/DeleteUniversity?id=${selectedUniversity.id}`);
            getAllUniversity(); // Refresh the list
            handleCloseDeleteDialog();
        } catch (error) {
            console.error("Error deleting university:", error);
            setError("Failed to delete university");
        } finally {
            setDeleteLoading(false);
        }
    }

    
    const handleUniversityUpdated = () => {
        handleCloseEditDialog();
        getAllUniversity();
    }

useEffect(() => {
  getAllUniversity();
},[])

 if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading universities...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


  return (
    <div className='flex flex-col gap-5'>
        <h2 className='text-[50px] font-bold'>universities</h2>
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
 Add University
</Button>
            </div>
        </div>

        <div>
          <DynamicTable
            columns={columns}
            data={universities}
            showActions={true}
            onRowClick={(row) => console.log('Row clicked:', row)}
            onEdit={(row) => handleOpenEditDialog(row)}
            onDelete={(row) => handleOpenDeleteDialog(row)}
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
                <AddUniversityForm 
                    onClose={handleCloseAddDialog}
                    onSuccess={handleUniversityAdded}
                />
            </Dialog>
             <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                maxWidth="md"
                fullWidth
            >
                {selectedUniversity && (
                    <EditUniversityForm 
                        university={selectedUniversity}
                        onClose={handleCloseEditDialog}
                        onSuccess={handleUniversityUpdated}
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
                      Delete University
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                       Are you sure deleting this university?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                    <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteUniversity} 
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

export default University