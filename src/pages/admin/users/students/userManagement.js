import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Layout from "@/components/Layout";
import { userRoles } from "@/assets/constants/authConstants";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/allUsers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filter: "", role: userRoles.STUDENT }), // Fetch all users
    })
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <Layout>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>District</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Current Station</TableCell>
              <TableCell>NIC/Passport</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Faculty Reg. Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.occupation}</TableCell>
                <TableCell>{user.district}</TableCell>
                <TableCell>{user.city}</TableCell>
                <TableCell>{user.currentStation}</TableCell>
                <TableCell>{user.nicOrPassport}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.batch}</TableCell>
                <TableCell>{user.faculty}</TableCell>
                <TableCell>{user.facultyRegNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
}
