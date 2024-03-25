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
  