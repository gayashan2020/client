//src\pages\admin\courses\manageCourses\index.js

import React, { useEffect, useState, useContext } from "react";
import Layout from "@/components/Layout"; // Adjust the path as needed
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { fetchCourses } from "@/services/courses";
import { LoadingContext } from "@/contexts/LoadingContext";

export default function ManageCourses() {
  const [courses, setCourses] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    getAllCourses();
  }, []);

  const getAllCourses = async () => {
    setLoading(true);
    const response = await fetchCourses();
    setLoading(false);
    if (response) {
      setCourses(response);
    } else {
      console.error("Failed to fetch courses");
    }
  };

  return (
    <Layout>
      <TableContainer component={Paper} sx={{ minHeight: "100vh" }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Authors</TableCell>
              <TableCell align="right">Keywords</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow
                key={course._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {course.name}
                </TableCell>
                <TableCell align="right">{course.category}</TableCell>
                <TableCell align="right">
                  {Array.isArray(course.authors)
                    ? course.authors.join(", ")
                    : course.authors}
                </TableCell>
                <TableCell align="right">
                  {Array.isArray(course.keywords)
                    ? course.keywords.join(", ")
                    : course.keywords}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
