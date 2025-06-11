import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RxAvatar } from "react-icons/rx";
import { FaStar } from "react-icons/fa";
import DynamicTable from "../component/DynamicTable";
const DoctorProfile = () => {
  const { id } = useParams(); // Get ID from URL params
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctors, setDoctors] = React.useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const getDoctorView = async () => {
      try {
        const response = await axios.get(
          `https://thirdpartyy.runasp.net/api/Doctors/GetDoctorById?id=${id}`
        );
         setDoctor(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDoctorView();
  }, [id]);// Re-run effect when ID changes

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




];

const columnsCourses = [
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

   const getAllCourses = async () => {
        try {
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Courses/GetDoctorCourses?id=${id}`);
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
    getAlldoctors();
    getAllCourses();
},[])


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>Loading doctor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
          <h2 className='text-[50px] font-bold'>Doctors / {doctor?.doctorName}</h2>
    <div className="w-full flex gap-5">
        <div className="w-1/3 flex flex-col gap-5">
            <div className="bg-white w-full flex items-center gap-5 p-5 rounded-lg shadow-md">
               {
                doctor?.imagePath ? (
                    <img
                    src={`https://thirdpartyy.runasp.net/${doctor?.imagePath}`}
                    alt={doctor.doctorName}
                    className="w-24 h-24 rounded-full object-cover"
                />
                ) :(
                    <RxAvatar className="w-24 h-24 text-gray-400" title="No Image Available" />
                )
               }

              
                <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{doctor.doctorName}</h3>
                    <span className="flex items-center gap-1">
                        <FaStar className="text-[#EFA61B] text-[16px]" />
                        <p className="text-[#EFA61B] text-[20px]">{doctor.rating}</p>
                    </span>
                    <p className=" text-[20px] text-[#787878]">{doctor.universityName}</p>
                    <p className=" text-[20px] text-[#787878]">{doctor.courses}</p>

                </div>
            </div>
            <div className="bg-white w-full p-5 rounded-lg shadow-md">

                  <DynamicTable
                    columns={columns}
                    data={doctors}
                    showActions={false}
                    onRowClick={(row) => console.log('Row clicked:', row)}
                    onEdit={(row) => handleOpenEditDialog(row)}
                    onDelete={(row) => handleOpenDeleteDialog(row)}                   
                    onView={(row) => navigate(`/doctor/${row.id}`)}
                    selectable={false} // Set to true if you want to enable row selection
                  />
  
            </div>

        </div>
        <div className="w-2/3 bg-white p-5 rounded-lg shadow-md">
          <h2 className='text-[40px] font-bold'>courses</h2>
            <div>
            <DynamicTable
                columns={columnsCourses}
                data={courses}
                showActions={false}
                onRowClick={(row) => console.log('Row clicked:', row)}
                onEdit={(row) => console.log('Edit:', row)}
                onDelete={(row) => handleOpenDeleteDialog(row)}
                onView={(row) => console.log('View:', row)}
                selectable={false}
                    />
            </div>
        </div>

    </div>
    </div>
  );
};

export default DoctorProfile;