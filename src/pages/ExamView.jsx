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
import {useParams} from "react-router-dom";
import AddExamQuestionForm from '../component/ExamQuestions/AddExamQuestionForm';
import EditExamQuestionForm from '../component/ExamQuestions/EditExamQuestionForm';
const ExamView = () =>  {
    const { id } = useParams(); // Get ID from URL params
    const [all, setAll] = React.useState('');
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    



    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    const handleOpenEditDialog = (question) => {
            setSelectedQuestion(question);
            setOpenEditDialog(true);
        };
        
    const handleCloseEditDialog = () => {
            setOpenEditDialog(false);
            setSelectedQuestion(null);
        };
    const handleOpenDeleteDialog = (question) => {
        setSelectedQuestion(question);
        setOpenDeleteDialog(true);
        };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedQuestion(null);
        };
    const handleChange = (event) => { 
        setAll(event.target.value );
    };
    // Toggle add university dialog
    const handleOpenAddDialog = () => setOpenAddDialog(true);
    const handleCloseAddDialog = () => setOpenAddDialog(false);

    const getAllExamQuestions = async () => {
        try{
          const response = await axios.get(`https://thirdpartyy.runasp.net/api/Questions/GetExamQuestion?id=${id}`);
          setQuestions(response.data);
          setLoading(false);
          console.log("Questions fetched successfully:", response.data);
        }catch (error) {
          setLoading(false);
          console.error("Error fetching Questions:", error);
        }
    }
    
    useEffect(() => {
        getAllExamQuestions();
    },[])


const columns = [
  {
    field: 'question',
    headerName: 'Question',
    minWidth: 200,
    sortable: true,
    renderCell: (row) => (
      <div style={{ fontWeight: 'bold' }}>
        {row.text}
      </div>
    )
  },

  {
    field: 'correct answer',
    headerName: 'correct answer',
     align: 'center',
    minWidth: 150,
    sortable: true,
    renderCell: (row) => (
      <div >
        {row.correctAnswer}
      </div>
    )
  },
  {
    field: 'PAC',
    headerName: 'PAC',
    align: 'center',
    minWidth: 120,
    renderCell: (row) => (
      <div>
        <span>{row.PAC}</span>
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
   const handleQuestionAdded = () => {
        handleCloseAddDialog();
        getAllExamQuestions();
    }
   const handleQuestionUpdated = () => {
        handleCloseEditDialog();
        getAllExamQuestions();
    }


       const handleDeleteQuestion = async () => {
                if (!selectedQuestion) return;
                
                setDeleteLoading(true);
                try {
                    await axios.delete(`https://thirdpartyy.runasp.net/api/Questions/Deletequestion/${selectedQuestion.id}`);
                    getAllExamQuestions(); 
                    handleCloseDeleteDialog();
                } catch (error) {
                    console.error("Error deleting Doctors:", error);
                    setError("Failed to delete Doctors");
                } finally {
                    setDeleteLoading(false);
                }
            }
  return (
    <div className='flex flex-col gap-5'>
        <h2 className='text-[50px] font-bold'>Exams / Exam Question</h2>
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
         Add Question
        </Button>
         </div>
        </div>
        <div>
        <DynamicTable
            columns={columns}
            data={questions}
            showActions={true}
            onRowClick={(row) => console.log('Row clicked:', row)}
            // onEdit={(row) => handleOpenEditDialog(row)}
            onDelete={(row) => handleOpenDeleteDialog(row)}                   
            // onView={(row) => console.log('View:', row)}
            showNotActive={false}
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
                        <AddExamQuestionForm 
                            onClose={handleCloseAddDialog}
                            onSuccess={handleQuestionAdded}
                        />
                </Dialog>

                <Dialog 
                            open={openEditDialog}
                            onClose={handleCloseEditDialog}
                            maxWidth="md"
                            fullWidth
                        >
                          {
                          selectedQuestion && (
                            <EditExamQuestionForm
                            question={selectedQuestion}
                            onClose={handleCloseEditDialog}
                            onSuccess={handleQuestionUpdated}
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
                              Delete Question
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description" sx={{ fontSize: '16px', fontWeight: '500', color: "#787878" }}>
                                Are you sure deleting this question?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center ', alignItems: "center", padding: '16px' }}>
                            <Button sx={{width: "192px", height: "50px", backgroundColor:"#fff", color: "black", border:"1px solid #000" }} onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleDeleteQuestion} 
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

export default ExamView