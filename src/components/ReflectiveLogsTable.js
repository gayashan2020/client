import React, { useEffect, useState, useContext } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Container,
  Typography,
} from "@mui/material";
import { fetchAllReflectiveLogs } from "@/services/reflectiveLog";
import { LoadingContext } from "@/contexts/LoadingContext";

const ReflectiveLogsTable = ({ userId }) => {
  const [reflectiveLogs, setReflectiveLogs] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    const loadReflectiveLogs = async () => {
      try {
        setLoading(true);
        const logs = await fetchAllReflectiveLogs(userId);
        setReflectiveLogs(logs);
      } catch (error) {
        console.error("Failed to fetch reflective logs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadReflectiveLogs();
    }
  }, [userId, setLoading]);

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Reflective Logs
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="reflective logs table">
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell align="right">Mentor Name</TableCell>
              <TableCell align="right">Learning Experience</TableCell>
              <TableCell align="right">What Did I Learn</TableCell>
              <TableCell align="right">More To Learn</TableCell>
              <TableCell align="right">How To Learn</TableCell>
              <TableCell align="right">Evidence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reflectiveLogs.map((log) => (
              <TableRow
                key={log._id} // Assuming each log has a unique _id
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {log.courseName}
                </TableCell>
                <TableCell align="right">{log.mentorName}</TableCell>
                <TableCell align="right">{log.learning_experience}</TableCell>
                <TableCell align="right">{log.what_did_I_learn}</TableCell>
                <TableCell align="right">{log.more_to_learn}</TableCell>
                <TableCell align="right">{log.how_to_learn}</TableCell>
                <TableCell align="right">
                  {log?.file && (
                    <a
                      href={log.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Attached File
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ReflectiveLogsTable;
