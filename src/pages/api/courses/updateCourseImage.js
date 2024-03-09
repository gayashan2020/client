import { createRouter } from "next-connect";
import multer from "multer";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

// Initialize multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Create a router using the new createRouter function
const router = createRouter();

router.use(upload.single("courseImage")); // Apply multer middleware to process file upload

router.put(async (req, res) => {
  const { db } = await dbConnect();

  const { file } = req;
  const { courseId } = req.body;

  if (!file || !courseId) {
    res
      .status(400)
      .send({ message: "No file uploaded or user ID not provided" });
    return;
  }

  // Create the file name using the courseId
  const filename = `courseImage_${courseId}.png`;
  const filePath = path.join(process.cwd(), "public", "images", filename);
  // Write the file to the file system in the public/images directory
  fs.writeFile(filePath, file.buffer, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error writing file" });
      return;
    }

    // Update the user's image path in the database
    const imageUrl = `/images/${filename}`;
    const result = await db.collection("courses").updateOne(
      { _id: new ObjectId(courseId) }, // Use `new` keyword here
      { $set: { image: imageUrl } }
    );

    if (result.modifiedCount > 0) {
      res
        .status(200)
        .send({ message: "Avatar updated successfully", imageUrl });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  });
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler();
