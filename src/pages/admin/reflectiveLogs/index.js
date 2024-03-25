import React, { useEffect, useState, useContext } from "react";
import { Container, Typography } from "@mui/material";
import { fetchCurrentUser } from "@/services/users";
import { LoadingContext } from "@/contexts/LoadingContext";
import Layout from "@/components/Layout";
import ReflectiveLogsTable from "@/components/ReflectiveLogsTable";

const ReflectiveLogsAdmin = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true);
    fetchCurrentUser()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch((error) => {
        console.error("Failed to fetch current user", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setLoading]);

  return (
    <Layout>
      {currentUser && <ReflectiveLogsTable userId={currentUser._id} />}
    </Layout>
  );
};

export default ReflectiveLogsAdmin;
