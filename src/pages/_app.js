// src/pages/_app.js

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationProvider';
import { LoadingBackdrop } from '@/components/LoadingBackdrop';
import '../styles/global.css';
import '../styles/dateRangePickerDarkMode.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <NotificationProvider>
          <Component {...pageProps} />
          <ToastContainer />
          <LoadingBackdrop />
        </NotificationProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}

export default MyApp;
