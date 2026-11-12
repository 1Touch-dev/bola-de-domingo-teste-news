import type { Metadata } from "next";
import Script from "next/script";
import { QueryProvider } from "@/components/QueryProvider";
import { Newsreader, Outfit } from "next/font/google";
import { site } from "@/config/site";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const revalidate = 120;

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
};

const organization = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
      inLanguage: "pt-BR",
    },
    {
      "@type": "NewsMediaOrganization",
      name: site.name,
      url: site.url,
      email: site.email,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
      publishingPrinciples: `${site.url}/sobre`,
      areaServed: {
        "@type": "Country",
        name: "Brasil",
      },
    },
  ],
};

interface IRootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = (props: IRootLayoutProps) => {
  const { children } = props;

  return (
    <html lang="pt-BR" className={`${outfit.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full bg-page font-sans text-ink">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${site.gaId}');`}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <QueryProvider>
          <SiteShell>{children}</SiteShell>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
