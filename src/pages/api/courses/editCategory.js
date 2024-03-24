// pages/api/courses/editCategories.js
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { db } = await dbConnect();
  
  const {
    categoryId,
    newCategory,
  } = req.body;

  // Verify that the necessary fields are provided
  if (!categoryId || !newCategory) {
    res.status(400).json({ message: "Category ID and new category name must be provided" });
    return;
  }

  try {
    // Convert categoryId to ObjectId for querying
    const categoryObjectId = new ObjectId(categoryId);

    // Update the category
    const response = await db.collection("courseCategories").updateOne(
      { _id: categoryObjectId },
      { $set: { category: newCategory } }
    );

    // Check if the category was found and updated
    if (response.matchedCount === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    if (response.modifiedCount === 0) {
      res.status(200).json({ message: "Category not modified" });
      return;
    }

    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating category" });
  }
}
