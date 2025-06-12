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
import { useParams } from 'react-router-dom';

const LectureLesson = () => {
    const {id} = useParams()
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

        const getAllLessons = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Lessons/GetLessonsByLecture?id=${id}`);
            setLessons(response.data);
            setLoading(false);
            console.log("lessons fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching lessons:", error);
        }
    };
    
    useEffect(() => {
        getAllLessons()
    },[])

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 200,
            sortable: true,
            renderCell: (row) => (
                <div style={{ fontWeight: 'bold' }}>
                    {row.description}
                </div>
            )
        },
        {
            field: 'type',
            headerName: 'Type',
            minWidth: 200,
            sortable: true,
            renderCell: (row) => (
                <div style={{ fontWeight: 'bold' }}>
                    {row.type}
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
  return (
    <div className='flex flex-col gap-5'>
                <h2 className='text-[50px] font-bold'>Course / Lecture / Lessons</h2>
          <div>
                       <DynamicTable
                           columns={columns}
                           data={lessons}
                           showActions={true}
                           onRowClick={(row) => console.log('Row clicked:', row)}
                        //    onEdit={(row) => console.log('Edit:', row)}
                        //    onDelete={(row) => handleOpenDeleteDialog(row)}
                        //    onView={(row) => navigate(`/course/${row.id}`)}
                           selectable={false}
                       />
                   </div>
    </div>
  )
}

export default LectureLesson