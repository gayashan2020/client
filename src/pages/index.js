// pages/index.js
import { getSession } from '../lib/session';
import LandingPage from './landingPage';
import LandingPage2 from './landingPage2'

export default function Home() {
  // Render your landing page content here
  return <LandingPage2 />;
}

export async function getServerSideProps(context) {
  const session = await getSession(context.req);

  // If there's a session, it means the user is authenticated
  if (session) {
    // Redirect to /admin
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  // If no session, continue to render the Home (LandingPage)
  return {
    props: {}, // You can pass some default props to your landing page if needed
  };
}

