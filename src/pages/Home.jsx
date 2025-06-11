import React, {useEffect, useState} from 'react';
import { BiSolidGroup } from "react-icons/bi";
import { BsFillBoxFill } from "react-icons/bs";
import { BsMailbox2Flag } from "react-icons/bs";
import { TbBrandYoutubeFilled } from "react-icons/tb";
import DynamicTable from '../component/DynamicTable';
import axios from 'axios';
import Cookies from 'js-cookie';
// import {jwt_decode }from 'jwt-decode';
import { jwtDecode } from "jwt-decode";

const Home = () => {

    const [universities, setUniversities] = React.useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
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
    const getAllCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetCourses?page=1&size=10`);
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
        setLoading(true); 
        getAllUniversity();
        getAllCourses();
    }, []);

  if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading universities...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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

];


 const CourseColumns = [
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
   
      
    ];

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

if (user) {
  console.log('Name:', user.name);
  console.log('ID:', user.id);
  console.log('Role:', user.role);
  console.log('Image:', user.image);
}
  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-[50px] font-bold'>Dashboard</h1>
      <div className='grid grid-cols-4 gap-5'>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Students</p>
            <p className='font-bold text-[24px] text-[#202224]'>40,689</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[#8280FF] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BiSolidGroup className='text-[40px] text-[#3D42DF]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total universities</p>
            <p className='font-bold text-[24px] text-[#202224]'>24</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BsFillBoxFill className='text-[40px] text-[#EFA61B]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Doctors</p>
            <p className='font-bold text-[24px] text-[#202224]'>401</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BsMailbox2Flag className='text-[40px] text-[#841A62]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Courses</p>
            <p className='font-bold text-[24px] text-[#202224]'>123</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <TbBrandYoutubeFilled className='text-[40px] text-[#F54135]' />
          </div>
        </div>
      </div>

      <div className='w-full grid grid-cols-2 gap-5'>
        <div className='w-full  bg-white rounded-lg shadow-md p-5 flex flex-col gap-5'>
          <h2 className='text-[24px] font-bold'>universities</h2>
         <div>
          <DynamicTable
            columns={columns}
            data={universities}
            showActions={false}
            onRowClick={(row) => console.log('Row clicked:', row)}
            // onEdit={(row) => handleOpenEditDialog(row)}
            // onDelete={(row) => handleOpenDeleteDialog(row)}
            onView={(row) => console.log('View:', row)}
            showNotActive={true}
            onNotActive={(row) => console.log('Marked as not active:', row)}
            selectable={false} // Set to true if you want to enable row selection
          />
        </div>
        </div>
      <div className='w-full  bg-white rounded-lg shadow-md p-5 flex flex-col gap-5'>
          <h2 className='text-[24px] font-bold'>Courses</h2>
         <div>
          <DynamicTable
            columns={CourseColumns}
            data={courses}
            showActions={false}
            onRowClick={(row) => console.log('Row clicked:', row)}
            // onEdit={(row) => handleOpenEditDialog(row)}
            // onDelete={(row) => handleOpenDeleteDialog(row)}
            onView={(row) => console.log('View:', row)}
            showNotActive={true}
            onNotActive={(row) => console.log('Marked as not active:', row)}
            selectable={false} // Set to true if you want to enable row selection
          />
        </div>
        </div>
      </div>
    </div>
  )
}

export default Home