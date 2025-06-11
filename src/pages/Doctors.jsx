import React, {useEffect, useState} from 'react'
import { GrFilter } from "react-icons/gr";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FaPlus } from 'react-icons/fa';
import Button from '@mui/material/Button';
import DynamicTable from '../component/DynamicTable';
import EditDoctorForm from '../component/doctors/EditDoctorForm';
import AddDoctorForm from '../component/doctors/AddDoctorForm';
import { 
    DialogContentText,
    DialogActions,
    DialogContent,
    DialogTitle,  
    Dialog  
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Doctors = () => {
  const navigate = useNavigate();

        const [all, setAll] = React.useState('');
        const [openAddDialog, setOpenAddDialog] = useState(false);
        const [openEditDialog, setOpenEditDialog] = useState(false);
        const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
        const [selectedDoctor, setSelectedDoctor] = useState(null);
        const [deleteLoading, setDeleteLoading] = useState(false);

        
        const handleOpenEditDialog = (doctor) => {
            setSelectedDoctor(doctor);
            setOpenEditDialog(true);
        };
        
        const handleCloseEditDialog = () => {
            setOpenEditDialog(false);
            setSelectedDoctor(null);
        };


        const handleOpenDeleteDialog = (doctor) => {
        setSelectedDoctor(doctor);
        setOpenDeleteDialog(true);
        };

        const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedDoctor(null);
        };

        // Toggle add doctors dialog
        const handleOpenAddDialog = () => setOpenAddDialog(true);
        const handleCloseAddDialog = () => setOpenAddDialog(false);

        const handleChange = (event) => { 
            setAll(event.target.value );
        };

    //implement table
    const [doctors, setDoctors] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);


    const columns = [

      {
        field: 'name',
        headerName: ' Name',
        minWidth: 200,
        sortable: true,
        renderCell: (row) => (
          <div style={{ fontWeight: 'bold' }}>
            {row.doctorName}
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
    field: 'university',
    headerName: 'University',
    align: 'center',
    minWidth: 150,
    sortable: true,
    renderCell: (row) => (
      <div >
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

//get doctors
const getAlldoctors = async () => {
    try{
      const response = await axios.get(`https://thirdpartyy.runasp.net/api/Doctors/GetDoctors?page=1&size=10`);
      setDoctors(response.data);
      setLoading(false);
      console.log("doctors fetched successfully:", response.data);
    }catch (error) {
      setLoading(false);
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again later", error);
    }
}
   const handleDoctorAdded = () => {
        handleCloseAddDialog();
        getAlldoctors();
    }

   const handleDeleteDoctor = async () => {
            if (!selectedDoctor) return;
            
            setDeleteLoading(true);
            try {
                await axios.delete(`https://thirdpartyy.runasp.net/api/Doctors/DeleteDoctor?id=${selectedDoctor.id}`);
                getAlldoctors(); 
                handleCloseDeleteDialog();
            } catch (error) {
                console.error("Error deleting Doctors:", error);
                setError("Failed to delete Doctors");
            } finally {
                setDeleteLoading(false);
            }
        }

   const handleDoctorUpdated = () => {
        handleCloseEditDialog();
        getAlldoctors();
    }

useEffect(() => {
  getAlldoctors();
},[])

 if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading doctors...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }


  return (
    <div className="flex flex-col gap-5">
        <h2 className='text-[50px] font-bold'>Doctors</h2>
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
 add Doctor
</Button>
            </div>
        </div>
        <div>
                  <DynamicTable
                    columns={columns}
                    data={doctors}
                    showActions={true}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => handleOpenEditDialog(row)}
                    onDelete={(row) => handleOpenDeleteDialog(row)}                   
                    onView={(row) => navigate(`/doctor/${row.id}`)}
                    selectable={false} // Set to true if you want to enable row selection
                  />
        </div>
                 <Dialog
                        open={openAddDialog}
                        onClose={handleCloseAddDialog}
                        maxWidth="md"
                        fullWidth
                    >
                        <AddDoctorForm 
                            onClose={handleCloseAddDialog}
                            onSuccess={handleDoctorAdded}
                        />
                    </Dialog>
                    <Dialog 
                       open={openEditDialog}
                        onClose={handleCloseEditDialog}
                        maxWidth="md"
                        fullWidth
                    >
                     {
                      selectedDoctor && (
                        <EditDoctorForm
                        doctor={selectedDoctor}
                        onClose={handleCloseEditDialog}
                        onSuccess={handleDoctorUpdated}
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
                                    Delete Doctor
                              </DialogTitle>
                              <DialogContent>
                                  <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                      Are you sure deleting this Doctor?
                                  </DialogContentText>
                              </DialogContent>
                              <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                                  <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                                      Cancel
                                  </Button>
                                  <Button 
                                      onClick={handleDeleteDoctor} 
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

export default Doctors