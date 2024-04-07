// services/dashboard.js
import axios from "axios";

export const getOccupationData = async () => {
  try {
    const response = await axios.get("/api/dashboard/occupationData");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getCityData = async () => {
  try {
    const response = await axios.get("/api/dashboard/cityData");

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getUserData = async () => {
  try {
    const response = await axios.get("/api/dashboard/userData");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export async function fetchRegisteredCourses(userId) {
  try {
    const { data } = await axios.get(
      `/api/dashboard/registeredCourses?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching registered courses:", error);
    throw error;
  }
}
