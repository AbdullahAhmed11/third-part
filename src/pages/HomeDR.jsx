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

const HomeDR = () => {

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


    </div>
  )
}

export default HomeDR