import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Decyde — AI Deployment Intelligence System',
  description: 'Decide if AI should exist before you build it.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
