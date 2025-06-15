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
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { RxCheck } from "react-icons/rx";
import { VscClose } from "react-icons/vsc";
import { ToastContainer, toast } from 'react-toastify';



const HomeDR = () => {

    const [universities, setUniversities] = React.useState([]);
    const [dashData, setDashData] = useState(null)
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [courseRequest, setCourseRequest] = useState([])
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


    const getDashData = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Admins/GetStatisticsForAdmin`);
            setDashData(response.data);
            setLoading(false);
            console.log("data fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    const getCourseRequests = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/CourseRequests/GetCourseRequests?page=1&size=30`);
            setCourseRequest(response.data);
            setLoading(false);
            console.log("data fetched successfully:", response.data);
        } catch (error) {
            setError(error.message);
            setLoading(false);
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        setLoading(true); 
        getAllUniversity();
        getAllCourses();
        getDashData();
        getCourseRequests();
    }, []);

  if (loading) {
        return <div className='flex items-center justify-center text-[30px]'>Loading universities...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
const handleAccept = async (id) => {
  try {
    await axios.post('https://thirdpartyy.runasp.net/api/CourseRequests/AcceptRequest', { id });
    toast.success('Request accepted!');
    getCourseRequests(); // refresh
  } catch (err) {
    toast.error('Failed to accept request');
    console.error(err);
  }
};

const handleReject = async (id) => {
  try {
    await axios.delete(`https://thirdpartyy.runasp.net/api/CourseRequests/DeleteRequest?id=${id}`);
    toast.success('Request rejected!');
    getCourseRequests(); // refresh
  } catch (err) {
    toast.error('Failed to reject request');
    console.error(err);
  }
};


  return (
    <div className='flex flex-col gap-5'>
      <h1 className='text-[50px] font-bold'>Dashboard</h1>
      <div className='grid grid-cols-4 gap-5'>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Students</p>
            <p className='font-bold text-[24px] text-[#202224]'>{dashData?.students}</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[#8280FF] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BiSolidGroup className='text-[40px] text-[#3D42DF]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total universities</p>
            <p className='font-bold text-[24px] text-[#202224]'>{dashData?.universities}</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BsFillBoxFill className='text-[40px] text-[#EFA61B]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Doctors</p>
            <p className='font-bold text-[24px] text-[#202224]'>{dashData?.doctors}</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <BsMailbox2Flag className='text-[40px] text-[#841A62]' />
          </div>
        </div>
        <div className='bg-white p-5 flex justify-between rounded-lg shadow-md'>
          <div className='flex flex-col justify-between'>
            <p className='font-meduim text-[16px] text-[#202224]'>Total Courses</p>
            <p className='font-bold text-[24px] text-[#202224]'>{dashData?.courses}</p>
            <p className='font-bold text-[20px] text-[#202224]'>1.3% Up from past month</p>
          </div>
          <div className='bg-[] w-[60px] h-[60px] rounded-[16px] flex items-center justify-center'>
            <TbBrandYoutubeFilled className='text-[40px] text-[#F54135]' />
          </div>
        </div>
      </div>

      <div className='w-full flex gap-5'>
        <div className='w-1/2 flex flex-col p-4 bg-white h-[500px] rounded-lg shadow-md'>
        <h2 className='text-[50px] font-bold'>Courses Requests</h2>
 <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell><strong>Course</strong></TableCell>
          <TableCell><strong>Students</strong></TableCell>
          <TableCell><strong>Date</strong></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {courseRequest?.map((request, index) => (
          <TableRow key={request.id}>
            <TableCell>{request.title || 'N/A'}</TableCell>
            <TableCell>{request.name || request.students?.length || 'N/A'}</TableCell>
            <TableCell>{new Date(request.date || request.requestDate).toLocaleDateString()}</TableCell>
            <TableCell    onClick={() => handleAccept(request.id)}>
              <div className='w-[30px] cursor-pointer h-[30px] rounded-full border-2 border-[#1A843C] flex items-center justify-center'>
                <RxCheck className='text-3xl text-[#1A843C]'/>
              </div>
            </TableCell>
            <TableCell     onClick={() => handleReject(request.id)}>
                <div className='w-[30px] h-[30px] cursor-pointer  rounded-full border-2 border-[#F54135] flex items-center justify-center'>
                <VscClose className='text-3xl text-[#F54135]'/>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
        </div>
        <div className='w-1/2 bg-white h-[500px] rounded-lg shadow-md'>

        </div>
      </div>

<ToastContainer/>
    </div>
  )
}

export default HomeDR