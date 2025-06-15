import React, { useEffect, useState } from 'react';
import { GrFilter } from "react-icons/gr";
import { FaPlus } from 'react-icons/fa';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const Ads = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

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

  useEffect(() => {
    const fetchAds = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(
            `https://thirdpartyy.runasp.net/api/Ads/GetAds?id=${user.id}`
          );
          setAds(response.data);
        }
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError('Failed to load ads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [user?.id]);

  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedFile(null);
    setUploadError('');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('Image', selectedFile);
    formData.append('DoctorId', user.id);

    try {
      setUploading(true);
      const response = await axios.post(
        'https://thirdpartyy.runasp.net/api/Ads/AddAds',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Refresh the ads list
      const adsResponse = await axios.get(
        `https://thirdpartyy.runasp.net/api/Ads/GetAds?id=${user.id}`
      );
      setAds(adsResponse.data);

      handleCloseAddDialog();
    } catch (err) {
      console.error('Error uploading ad:', err);
      setUploadError('Failed to upload ad. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 p-4'>
      <h2 className='text-4xl font-bold'>Ads</h2>
      
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-8'>
          <GrFilter className='text-3xl text-black' />
          <span className='text-xl font-bold'>Filter</span>
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
                backgroundColor: '#d69519',
              },
              textTransform: 'none',
              padding: '8px 16px',
            }}
            onClick={handleAddClick}
          >
            Add Ad
          </Button>
        </div>
      </div>

      {ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div 
              key={ad.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://thirdpartyy.runasp.net${ad.imagePath}`}
                  alt={`Ad ${ad.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Ad+Image';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Ad #{ad.id}</h3>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#EFA61B',
                      color: '#EFA61B',
                      '&:hover': {
                        borderColor: '#d69519',
                      },
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No ads available</p>
        </div>
      )}

      {/* Add Ad Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Ad</DialogTitle>
        <DialogContent>
          <div className="mt-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-amber-50 file:text-amber-700
                hover:file:bg-amber-100"
            />
            {selectedFile && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: {selectedFile.name}
              </div>
            )}
            {uploadError && (
              <div className="mt-2 text-sm text-red-500">{uploadError}</div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={uploading}
            sx={{
              backgroundColor: '#EFA61B',
              color: 'white',
              '&:hover': {
                backgroundColor: '#d69519',
              },
              '&:disabled': {
                backgroundColor: '#e5e7eb',
                color: '#9ca3af',
              },
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Ads;