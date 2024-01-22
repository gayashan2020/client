// pages/admin/index.js

import { getSession } from "../../lib/session";
import { Box } from "@mui/material";
import Layout from "../../components/Layout";

export default function AdminPage() {
  // Your page component
  return (
    <Layout>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Dashboard</h1>
        </Box>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context.req);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
