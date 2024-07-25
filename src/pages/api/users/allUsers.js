// src/pages/api/users/allUsers.js

import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { filter, role } = req.body;

    const { db } = await dbConnect();
    let query = { role: { $ne: "super_admin" } };

    if (filter) {
      query.$or = [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
        { username: { $regex: filter, $options: "i" } },
        { email: { $regex: filter, $options: "i" } },
      ];
    }

    if (role && role !== "") {
      query.role = role;
    }

    const users = await db.collection("users").find(query).toArray();

    // Don't send the passwords to the client
    const sanitizedUsers = users.map((user) => {
      delete user.password;
      return user;
    });

    return res.status(200).json(sanitizedUsers);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
