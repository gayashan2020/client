// api/dashboard/cityData.js
import dbConnect from "@/lib/dbConnect";

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      const { db } = await dbConnect();

      const districtData = await db
        .collection("users")
        .aggregate([{ $group: { _id: "$district", count: { $sum: 1 } } }])
        .toArray();
      console.log("districtData",districtData);
      if (districtData) {
        res.status(200).json(
          districtData.map((item) => ({
            district: item._id,
            count: item.count,
          }))
        );
      } else {
        res.status(500).json({ message: "No district data found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
