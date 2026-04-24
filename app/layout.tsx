import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Decyde — Decide if AI should exist before you build it',
  description:
    'Decyde is an AI Deployment Intelligence System. Evaluate any workflow and decide whether it should be an AI Agent, Copilot, Workflow Automation, Analytics Only, or Not Automated at all.',
  keywords: [
    'AI product management',
    'AI deployment',
    'AI feasibility',
    'AI strategy',
    'workflow automation',
    'copilot',
    'AI agent',
  ],
  authors: [{ name: 'Decyde' }],
  openGraph: {
    title: 'Decyde — Decide if AI should exist before you build it',
    description:
      'A decision-grade AI Deployment Intelligence System for product teams.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#00D4FF',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased selection:bg-electric-500/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
