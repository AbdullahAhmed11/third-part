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


const Articles = () => {
      const [all, setAll] = React.useState([]);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      const [articles, setArticles] = useState([]);



      const getAllArticles = async () => {
          try{
            const response = await axios.get(`https://thirdpartyy.runasp.net/api/Lectures/GetLectures?courseId=${selectedCourse}`);
            setArticles(response.data);
            setLoading(false);
            console.log("Articles  fetched successfully:", response.data);
          }catch (error) {
            setLoading(false);
            console.error("Error fetching Articles:", error);
          }
      }

      useEffect(() => {
          setLoading(true);
          getAllArticles();
      }, []);

  return (
    <div>Articles</div>
  )
}

export default Articles