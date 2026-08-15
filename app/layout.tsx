import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
});

const siteUrl = 'https://ure.one';
const siteName = 'tomorrowme';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Say it now. Reveal it then.`,
    template: `%s — ${siteName}`,
  },
  description:
    'Seal digital messages, secrets, letters to your future self, or unreleased media. Cryptographically hidden until an exact future date.',
  applicationName: siteName,
  authors: [{ name: siteName }],
  generator: 'Next.js',
  keywords: [
    'time capsule',
    'message to future self',
    'digital time capsule',
    'sealed letter',
    'time-lock encryption',
    'future email',
    'private journal',
    'encrypted message',
    'capsule app',
    'letter to future me',
  ],
  referrer: 'origin-when-cross-origin',
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} — Say it now. Reveal it then.`,
    description:
      'Seal digital messages, secrets, letters, or unreleased media to your future self. Cryptographically hidden until the exact date you choose.',
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: `${siteName} — Sealed by math. Opened by time.`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} — Say it now. Reveal it then.`,
    description:
      'Seal digital messages to your future self. Cryptographically hidden until an exact future date.',
    images: ['/og/default.png'],
    creator: '@tomorrowme',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F8F4EC' },
    { media: '(prefers-color-scheme: dark)', color: '#1A1814' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-card focus:bg-paper focus:px-4 focus:py-2 focus:shadow-paper-lg"
        >
          Skip to content
        </a>
        <div id="main" className="flex-1">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
