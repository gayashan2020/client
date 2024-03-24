// pages/api/courses/addCategories.js
import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  const { db } = await dbConnect();

  let {
    category,
  } = req.body;

  // Access category collection
  const Category = db.collection("courseCategories");

  try {
    // Insert new course
    let response = await Category.insertOne({
        category,
    });

    res.status(200).json({ message: "Category added successfully", body: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding course" });
  }
}
