import './globals.css';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Makeup Service',
  description: 'Book your makeup service appointment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#ff4b4b',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
