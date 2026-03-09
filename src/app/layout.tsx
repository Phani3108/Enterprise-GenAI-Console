import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import TourProvider from '@/components/tour/TourProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Enterprise GenAI Strategy Console',
  description:
    'A decision system that helps CTOs and AI product leaders design, evaluate, and launch production AI systems for financial institutions.',
  authors: [{ name: 'Phani Marupaka', url: 'https://linkedin.com/in/phani-marupaka' }],
  creator: 'Phani Marupaka',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0B1020] text-[#F8FAFC]`}
      >
        <TourProvider />
        {children}
      </body>
    </html>
  );
}
