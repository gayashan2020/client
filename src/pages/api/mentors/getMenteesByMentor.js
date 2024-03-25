// src/pages/api/mentors/getMenteesByMentor.js

import dbConnect from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { mentorId } = req.body;
  if (!mentorId) {
    return res.status(400).json({ message: 'Missing mentorId in request.' });
  }

  const { db } = await dbConnect();

  try {
    // Fetch entries from users_courses where mentorId matches
    const userCourses = db.collection('users_courses');
    const menteeEntries = await userCourses.find({ mentorId: new ObjectId(mentorId) }).toArray();

    if (!menteeEntries.length) {
      return res.status(404).json({ message: 'No mentees found for this mentor.' });
    }

    // Extract userIds and fetch details from users table
    const userIds = menteeEntries.map(entry => entry.userId);
    const users = db.collection('users');
    const menteeDetails = await users.find({ _id: { $in: userIds } }).toArray();

    // Optionally, filter out sensitive information from menteeDetails
    const filteredMenteeDetails = menteeDetails.map(({ password, ...rest }) => rest);

    res.status(200).json(filteredMenteeDetails);
  } catch (error) {
    console.error('Error fetching mentees by mentorId:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};
