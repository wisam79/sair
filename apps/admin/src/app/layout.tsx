import type { Metadata } from "next";
import { AppProvider } from "../providers/AppProvider";
import AdminLayout from "../components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "UniRide Admin",
  description: "Management dashboard for UniRide platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppProvider>
          <AdminLayout>{children}</AdminLayout>
        </AppProvider>
      </body>
    </html>
  );
}
