import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'M.O.S.A.D. — Surveillance AI Dashboard',
  description: 'Monitoring & Observation Surveillance AI Daemon — Admin Console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#060d16] text-white antialiased">{children}</body>
    </html>
  );
}
