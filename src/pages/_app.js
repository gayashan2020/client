// pages/_app.js
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from '@/contexts/LoadingProvider';
import { LoadingBackdrop } from '@/components/LoadingBackdrop';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <LoadingProvider>
      <Component {...pageProps} />
      <ToastContainer />
      <LoadingBackdrop />
    </LoadingProvider>
  )
}

export default MyApp;