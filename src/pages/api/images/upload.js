// src/pages/api/images/upload.js
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

router.use(upload.single("image")); // Apply multer middleware to process file upload

router.post(async (req, res) => {
  const { file } = req;
  
  if (!file) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  // Create a unique filename, optionally based on userId or some other unique identifier
  const filename = `uploadedImage_${Date.now()}.png`; // Unique filename based on timestamp
  const filePath = path.join(process.cwd(), "public", "images", filename);

  // Write the file to the file system in the public/images directory
  fs.writeFile(filePath, file.buffer, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error writing file" });
      return;
    }

    // Optionally, you can save the image path to the database
    const imageUrl = `/images/${filename}`;
    // If you want to associate the image with a user, you can update the user document here

    res.status(200).send({ message: "Image uploaded successfully", imageUrl });
  });
});

export const config = {
  api: {
    bodyParser: false, // Disable body parsing so that multer can handle the file upload
  },
};

export default router.handler();
