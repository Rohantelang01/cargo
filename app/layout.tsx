import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/hooks/useTheme';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/navbar/Navbar';
import SonnerToaster from '@/components/common/SonnerToaster';

export const metadata: Metadata = {
  title: 'Cargo — Book. Drive. Own. Earn.',
  description: 'India\'s smart hybrid ride platform. Passengers book instantly or in advance. Drivers and Owners earn fairly with transparent pricing.',
  keywords: ['cargo', 'ride sharing', 'instant booking', 'prebooking', 'transportation', 'india'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
              <Navbar />
              <SonnerToaster />
              <main className="flex-grow">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}