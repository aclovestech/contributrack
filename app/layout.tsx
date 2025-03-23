import type { Metadata } from 'next';
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter();

export const metadata: Metadata = {
  title: 'ContribuTrack',
  description: 'An app to track donation contributions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}><StackProvider app={stackServerApp}><StackTheme>{children}</StackTheme></StackProvider></body>
    </html>
  );
}
