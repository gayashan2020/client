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
}
