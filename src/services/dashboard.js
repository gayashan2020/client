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

export async function fetchRegisteredCoursesByUser(userId) {
  try {
    const { data } = await axios.get(
      `/api/dashboard/registerdCoursesByUser?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching registered courses:", error);
    throw error;
  }
}

export const getUserCount = async () => {
  try {
    const response = await axios.get("/api/dashboard/userCount");
    return response.data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

export const getUserCoursesCount = async () => {
  try {
    const response = await axios.get("/api/dashboard/userCoursesCount");
    // console.log('response',response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

export async function fetchSuperAdminData(userId) {
  try {
    const { data } = await axios.get(
      `/api/dashboard/superAdminData?userId=${userId}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching super admin data:", error);
    throw error;
  }
}

export async function getCoursesByMentor(mentorId = null) {
  try {
    const query = mentorId ? `?mentorId=${encodeURIComponent(mentorId)}` : "";
    const response = await fetch(`/api/dashboard/getCoursesByMentor${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const data = await response.json();
    return data.courseOverview;
  } catch (error) {
    console.error("getCoursesByMentor error:", error);
    throw error;
  }
}
