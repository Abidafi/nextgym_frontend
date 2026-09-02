import './globals.css';
import Providers from '@/components/Providers'; 
import { Toaster } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'GearUp - Rent Sports & Outdoor Gear',
  description: 'Rent Sports & Outdoor Gear Instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-slate-900 text-white selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}