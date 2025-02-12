import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matchy Matchy',
  description: 'Matchy Matchy is a game where you match colors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
