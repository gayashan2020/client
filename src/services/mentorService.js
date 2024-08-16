export async function fetchMenteesByMentor(mentorId) {
  try {
    const response = await fetch("/api/mentors/getMenteesByMentor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mentorId }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching mentees: ${response.statusText}`);
    }

    const mentees = await response.json();
    return mentees;
  } catch (error) {
    console.error("fetchMenteesByMentor error:", error);
    throw error;
  }
}

/**
 * Fetch detailed information for a specific student under a mentor, including personal details,
 * courses related to the current mentor, and their reflective logs.
 * @param {string} mentorId - The ID of the mentor.
 * @param {string} userId - The ID of the student.
 * @returns {Promise<Object>} The detailed information of the student including personal details,
 * courses, and reflective logs.
 * @throws {Error} Throws an error if the request fails.
 */
export async function fetchStudentDetails(mentorId, userId) {
  try {
    const response = await fetch("/api/mentors/getStudentDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mentorId, userId }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching student details: ${response.statusText}`);
    }

    const studentDetails = await response.json();
    return studentDetails;
  } catch (error) {
    console.error("fetchStudentDetails error:", error);
    throw error;
  }
}

/**
 * Approves a mentee for a specific course enrollment.
 *
 * @param {string} userId - The ID of the mentee to approve.
 * @param {string} courseId - The ID of the course for which the mentee is being approved.
 * @returns {Promise<Object>} The response from the server.
 */
export async function approveMentee(userId, courseId) {
  try {
    const response = await fetch("/api/mentors/approveMentee", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, courseId }),
    });

    if (!response.ok) {
      // Convert non-2xx HTTP responses into errors
      const errorBody = await response.text();
      throw new Error(`Error: ${response.status} - ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in approveMentee:", error);
    throw error; // Re-throw the error to be handled by the calling code
  }
}

export async function fetchMentorByCurrentUser() {
  try {
    const response = await fetch("/api/mentors/getMentorByCurrentUser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching mentor details: ${response.statusText}`);
    }

    const mentor = await response.json();
    return mentor;
  } catch (error) {
    console.error("fetchMentorByCurrentUser error:", error);
    throw error;
  }
}

/**
 * Fetch a list of students assigned to a specific mentor.
 * @param {string} mentorId - The ID of the mentor.
 * @returns {Promise<Array>} A promise that resolves to an array of students, each with personal details,
 * status, and course information.
 * @throws {Error} Throws an error if the request fails.
 */
export async function fetchMentorStudents(mentorId) {
  try {
    const response = await fetch("/api/mentors/getMentorStudents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mentorId }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching mentor students: ${response.statusText}`);
    }

    const students = await response.json();
    return students;
  } catch (error) {
    console.error("fetchMentorStudents error:", error);
    throw error;
  }
}

