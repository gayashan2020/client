import { createRouter } from "next-connect";
import multer from "multer";
import dbConnect from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

const upload = multer({ storage: multer.memoryStorage() });
const router = createRouter();

router.use(upload.single("reflectiveFile")); // Processing file upload named 'reflectiveFile'

router.post(async (req, res) => {
  const { db } = await dbConnect();

  const { file } = req;
  const { reflectiveLogId } = req.body;

  if (!file || !reflectiveLogId) {
    res.status(400).send({ message: "No file uploaded or reflective log ID not provided" });
    return;
  }

  const extension = file.mimetype.includes('image') ? '.png' : '.pdf';
  const filename = `reflectiveFile_${reflectiveLogId}${extension}`;
  const filePath = path.join(process.cwd(), "public", "uploads", filename);

  fs.writeFile(filePath, file.buffer, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error writing file" });
      return;
    }

    try {
      const fileUrl = `/uploads/${filename}`;
      const result = await db.collection("reflectiveLog").updateOne(
        { _id: new ObjectId(reflectiveLogId) },
        { $set: { file: fileUrl } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Reflective log not found" });
      }

      res.status(200).send({ message: "File uploaded successfully", fileUrl });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating reflective log file" });
    }
  });
});

export const config = {
  api: {
    bodyParser: false, // Disabling body parsing, multer will handle multipart/form-data
  },
};

export default router.handler();
