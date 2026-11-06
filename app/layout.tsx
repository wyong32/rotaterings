import type { Metadata } from "next";
import "./globals.css";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteScripts } from "@/components/site-scripts";
import { canonical, gameKeywords, OG_IMAGE, siteDescription, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rotate Rings Walkthrough Guides, Level Solutions & Tips",
    template: `%s | ${SITE_NAME}`
  },
  description: siteDescription,
  keywords: gameKeywords,
  authors: [{ name: "Rotate Rings Guide Team" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: canonical(),
    siteName: SITE_NAME,
    title: 'Rotate Rings Walkthrough Guides, Level Solutions & Tips',
    description: siteDescription,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Rotate Rings interlocking ring puzzle walkthrough guide'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rotate Rings Walkthrough Guides, Level Solutions & Tips',
    description: siteDescription,
    images: [OG_IMAGE]
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
  alternates: {
    canonical: canonical()
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-x-hidden bg-background font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
          storageKey="rotate-rings-theme"
        >
          <SiteScripts />
          <SiteNavbar />
          <main className="min-h-screen bg-background">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
