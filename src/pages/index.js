// pages/index.js

import LandingPage from './landingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <>
      <ToastContainer />
      <LandingPage />
    </>
  );
}