// services/dashboard.js
import axios from 'axios';

export const getOccupationData = async () => {
  try {
    const response = await axios.get('/api/dashboard/occupationData');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCityData = async () => {
    try {
      const response = await axios.get('/api/dashboard/cityData');
      console.log("City Data:", response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };