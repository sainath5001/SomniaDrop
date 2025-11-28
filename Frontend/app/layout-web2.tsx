import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ProvidersWeb2 } from '@/lib/providers-web2';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Plinkoo Game (Web2) - Somnia Data Streams',
  description: 'Play Plinkoo with Somnia Data Streams - No wallet required!',
};

export default function RootLayoutWeb2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <ProvidersWeb2>{children}</ProvidersWeb2>
      </body>
    </html>
  );
}



