// pages/admin/index.js

import { getSession } from "../../lib/session";
import { Box } from "@mui/material";
import Layout from "@/components/Layout";
import AdminDashboard from "./dashboard_temp";

export default function AdminPage() {
  // Your page component
  return (
    <Layout>
        <AdminDashboard />
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
