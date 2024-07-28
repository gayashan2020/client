import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingBackdrop } from '@/components/LoadingBackdrop';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Component {...pageProps} />
        <ToastContainer />
        <LoadingBackdrop />
      </LoadingProvider>
    </AuthProvider>
  );
}

export default MyApp;
