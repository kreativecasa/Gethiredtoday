import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gethiretoday.com"),
  title: {
    default: "Free AI Resume Builder — Get Hired Today | GetHireToday",
    template: "%s | GetHireToday",
  },
  description:
    "Build an ATS-friendly resume in 3 minutes with AI. Free to start. Tailored bullet points, professional templates, and an ATS checker that gets you past the bots and in front of real recruiters.",
  keywords: [
    "AI resume builder", "free resume builder", "ATS-friendly resume", "resume maker",
    "AI resume writer", "ATS checker", "resume templates 2026", "cover letter builder",
    "professional resume", "resume builder free", "online resume builder", "CV builder",
  ],
  authors: [{ name: "GetHireToday", url: "https://gethiretoday.com" }],
  creator: "GetHireToday",
  publisher: "GetHireToday",
  alternates: { canonical: "https://gethiretoday.com" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gethiretoday.com",
    siteName: "GetHireToday",
    title: "Free AI Resume Builder — Get Hired Today",
    description: "Build an ATS-friendly resume in 3 minutes with AI. Tailored bullet points, professional templates, and ATS compatibility checking. Free to start.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "GetHireToday — Free AI Resume Builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Resume Builder — Get Hired Today",
    description: "Build an ATS-friendly resume in 3 minutes with AI. Free to start.",
    images: ["/og-image.png"],
    creator: "@gethiretoday",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        {ga4Id && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "GetHireToday",
            "url": "https://gethiretoday.com",
            "logo": "https://gethiretoday.com/og-image.png",
            "description": "AI-powered resume builder that helps job seekers create ATS-friendly resumes and land more interviews.",
            "contactPoint": { "@type": "ContactPoint", "contactType": "customer support", "url": "https://gethiretoday.com/contact" },
            "sameAs": []
          })}}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "GetHireToday AI Resume Builder",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "url": "https://gethiretoday.com",
            "description": "Free AI resume builder with ATS compatibility checking, professional templates, and one-click PDF download.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "247" }
          })}}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
