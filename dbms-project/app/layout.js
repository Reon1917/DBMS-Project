import './globals.css';
import Layout from './components/Layout';

export const metadata = {
  title: 'Makeup Service',
  description: 'Book your makeup service appointment',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
