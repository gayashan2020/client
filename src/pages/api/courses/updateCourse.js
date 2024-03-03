// pages/api/courses/updateCourse.js 

import dbConnect from "@/lib/dbConnect";
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {

  const { db } = await dbConnect();

  const { id, update } = req.body;

  const courses = db.collection("courses");

  try {
    const response = await courses.updateOne(
      { _id: new ObjectId(id) }, 
      { $set: update }
    );

    res.status(200).json({message: "Course updated successfully", response});

  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Error updating course"});
  }

}
