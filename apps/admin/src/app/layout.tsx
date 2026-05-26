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
  title: 'Sair Admin',
  description: 'Management dashboard for Sair platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={ibmArabic.variable} style={{ margin: 0 }} suppressHydrationWarning>
        <AppProvider>
          <AdminLayout>{children}</AdminLayout>
        </AppProvider>
      </body>
    </html>
  );
}
