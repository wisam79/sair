import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { AppProvider } from '../providers/AppProvider';
import AdminLayout from '../components/layout';
import './globals.css';

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-arabic',
});

export const metadata: Metadata = {
  title: 'UniRide Admin',
  description: 'Management dashboard for UniRide platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={ibmArabic.variable} style={{ margin: 0 }} suppressHydrationWarning>
        <AppProvider>
          <AdminLayout>{children}</AdminLayout>
        </AppProvider>
      </body>
    </html>
  );
}
