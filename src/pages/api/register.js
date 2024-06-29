// pages/api/register.js

import dbConnect from "../../lib/dbConnect";
import { hashPassword } from "../../lib/auth";
import { userStatus } from "@/assets/constants/authConstants";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { db, client } = await dbConnect();

    // Destructure the request body
    const { password, ...otherDetails } = req.body;

    // Hash the password before storing it
    const hashedPassword = await hashPassword(password);

    // Insert the user into the 'users' collection
    const result = await db
      .collection("users")
      .insertOne({
        password: hashedPassword,
        ...otherDetails,
        status: userStatus.PENDING_APPROVAL.value,
      });

    // Close the database connection
    client.close();

    // Return the inserted user's ID
    res.status(200).json({ userId: result.insertedId });
  } else {
    // If the request method is not POST, return a 405 Method Not Allowed status
    res.status(405).json({ message: "Method not allowed" });
  }
}
