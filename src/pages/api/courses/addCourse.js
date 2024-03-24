// pages/api/courses/addCourse.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  let {
    name,
    image,
    category,
    categoryId,
    duration,
    cpdTotal,
    cpdMin,
    type,
    link,
    creator,
    description,
    objectives,
    authors,
    keywords,
    approved,
  } = req.body;

  //convert duration, cpdTotal, cpdMin to int
  duration = parseInt(duration);
  cpdTotal = parseInt(cpdTotal);
  cpdMin = parseInt(cpdMin);

  // Access courses collection
  const courses = db.collection("courses");

  try {
    // Insert new course
    let response = await courses.insertOne({
      name,
      image,
      category,
      categoryId,
      duration,
      cpdTotal,
      cpdMin,
      type,
      link,
      creator,
      description,
      objectives,
      authors,
      keywords,
      approved,
    });

    res.status(200).json({ message: "Course added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding course" });
  }
}
