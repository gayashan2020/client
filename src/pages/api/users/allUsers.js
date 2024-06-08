// pages/api/allUsers.js

import dbConnect from "@/lib/dbConnect";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { filter, role } = req.body;

    const { db } = await dbConnect();
    let users;

    if (filter) {
      // If filter is provided, find users where firstname, lastname, username or email matches the filter
      users = await db
        .collection("users")
        .find({
          $or: [
            { firstName: { $regex: filter, $options: "i" } },
            { lastName: { $regex: filter, $options: "i" } },
            { username: { $regex: filter, $options: "i" } },
            { email: { $regex: filter, $options: "i" } },
          ],
          role: role,
          role: { $ne: "super_admin" },
        })
        .toArray();
    } else if (role && role !== "") {
      // If no filter is provided, return all users with the specified role
      users = await db.collection("users").find({ role: role, role: { $ne: "super_admin" } }).toArray();
    } else {
      users = await db.collection("users").find({role: { $ne: "super_admin" },}).toArray();
    }

    // Don't send the passwords to the client
    users = users.map((user) => {
      delete user.password;
      return user;
    });

    return res.status(200).json(users);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
