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
import { useNavigate,useParams } from 'react-router-dom';

const StudetnsCourse = () => {
    const [all, setAll] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const {id} = useParams()
    const navigate = useNavigate()

    
    const handleChange = (event) => { 
        setAll(event.target.value);
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://thirdpartyy.runasp.net/api/Students/GetStudents?courseId=${id}&page=1&size=10`
            );
            
            setStudents(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents()
    },[])

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
  return (
    <div className='flex flex-col gap-5 p-4'>
            <h2 className='text-4xl font-bold'>Students</h2>
    <div className='mt-4'>
                <DynamicTable
                    columns={columns}
                    data={students}
                    showActions={true}
                    // pagination={pagination}
                    // onPageChange={handlePageChange}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    // onEdit={(row) => handleOpenEditDialog(row)}
                    // onDelete={(row) => handleOpenDeleteDialog(row)}                   
                     onView={(row) => navigate(`/student/${row.id}`)}
                    selectable={false}
                />
            </div>
    </div>
  )
}

export default StudetnsCourse