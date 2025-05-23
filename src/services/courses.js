// src/services/courses.js

export async function addCourse(courseData) {
  const response = await fetch("/api/courses/addCourse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(courseData),
  });

  if (!response.ok) {
    throw new Error(`Error adding course: ${response.status}`);
  }

  return response.json();
}

export async function updateCourseImage(courseId, file) {
  // Create a FormData object to hold the file and any other data
  const formData = new FormData();
  formData.append("courseImage", file);
  formData.append("courseId", courseId);

  // Make a PUT request to the "updateCourseImage" API endpoint
  const response = await fetch("/api/courses/updateCourseImage", {
    method: "PUT",
    body: formData, // Send the FormData object directly without JSON.stringify
    // Do not set "Content-Type": "application/json" here because it's multipart/form-data
  });

  return response;
}

export async function fetchCourses(filter = "") {
  try {
    const response = await fetch("/api/courses/getCourses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const fetchCourseById = async (categoryId, courseId) => {
  const response = await fetch(`/api/courses/${categoryId}/${courseId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  return await response.json();
};

export async function enrollToCourse(userId, courseId, mentorId) {
  const response = await fetch("/api/courses/enroll", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId, mentorId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Enrollment error! ${errorData.message}`);
  }

  return await response.json();
}

export async function getEnrolledDataByCourse(userId, courseId) {
  const response = await fetch("/api/courses/getEnrolledDataByCourse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, courseId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Enrollment error! ${errorData.message}`);
  }

  return await response.json();
}

export async function updateCourse(courseId, updateData) {
  const response = await fetch("/api/courses/updateCourse", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: courseId,
      update: updateData,
    }),
  });

  if (!response.ok) {
    throw new Error(`Error updating course: ${response.status}`);
  }

  return response.json();
}

export const fetchCoursesByCategoryId = async (categoryId) => {
  const response = await fetch(`/api/courses/${categoryId}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  return await response.json();
};

export const fetchCoursesByCategoryIds = async (
  categoryNames,
  userId = null,
  searchTerm = "",
  organizers = []
) => {
  try {
    const response = await fetch("/api/courses/byCategoryIds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        categoryNames,
        userId,
        searchTerm,
        organizers,
      }),
    });

    if (!response.ok)
      throw new Error(`Error updating course: ${response.status}`);
    return response.json();
  } catch (error) {
    throw new Error("Failed to fetch courses by category IDs");
  }
};

export const updateCourseCategory = async (courseId, categoryName) => {
  try {
    const response = await fetch(`/api/courses/${categoryName}/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryName }),
    });

    if (!response.ok) {
      throw new Error(`Error updating course category: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw new Error("Failed to update course category");
  }
};
