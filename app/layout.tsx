import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bookmarks',
  description: 'Your new favorite bookmark place.',
};

const Head = () => (
  <>
    <head>
      <title>Bookmarks</title>
      <meta name="application-name" content="Bookmarks" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Bookmarks" />
      <meta name="description" content="Your new favorite bookmark place." />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />

      <link rel="apple-touch-icon" href="/ios/128.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/ios/152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/ios/180.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/ios/167.png" />

      <link rel="icon" type="image/png" sizes="32x32" href="/ios/32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/ios/16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/vercel.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=optional`" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://bookmarks-gamma-kohl.vercel.app" />
      <meta name="twitter:title" content="Bookmarks" />
      <meta name="twitter:description" content="Your new favorite bookmark place." />
      <meta name="twitter:image" content="https://bookmarks-gamma-kohl.vercel.app/icons/android-chrome-192x192.png" />
      <meta name="twitter:creator" content="@Sunwize" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Bookmarks" />
      <meta property="og:description" content="Your new favorite bookmark place." />
      <meta property="og:site_name" content="Bookmarks" />
      <meta property="og:url" content="https://bookmarks-gamma-kohl.vercel.app" />
      <meta property="og:image" content="https://bookmarks-gamma-kohl.vercel.app/icons/apple-touch-icon.png" />
    </head>
  </>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-slate-950 text-white leading-snug">
      <Head />
      <body className={`flex flex-col min-h-[100dvh] ${inter.className}`}>
        <Navbar />
        <main className="flex flex-col w-full flex-1 bg-white/10 max-w-[650px] mx-auto py-6 px-2 md:px-6">{children}</main>
      </body>
    </html>
  );
}
