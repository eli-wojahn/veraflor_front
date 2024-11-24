import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AdministradorProvider from "@/contexts/administrator";
import ClienteProvider from "@/contexts/client";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veraflor Garden - Floricultura e Jardinagem em Pelotas",
  description:
    "Conheça a Veraflor Garden em Pelotas. Oferecemos uma variedade de plantas, flores e acessórios de jardinagem.",
};

export default function RootLayout({ children }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Florist",
    name: "Veraflor Garden",
    description: metadata.description,
    image: "https://veraflor.vercel.app/images/pelotas.png",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Av. Dr. Félix Antônio Caputo, 251",
      addressLocality: "Pelotas",
      addressRegion: "RS",
      postalCode: "96070-060",
      addressCountry: "BR",
    },
    telephone: "+55(53)99956-1458",
    sameAs: [
      "https://www.facebook.com/veraflorgarden",
      "https://www.instagram.com/veraflorgarden",
    ],
    url: "https://veraflor.vercel.app",
  };

  return (
    <html lang="pt-br">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="canonical" href="https://veraflor.vercel.app" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />

        {/* Meta Tag de Verificação do Google */}
        <meta
          name="google-site-verification"
          content="2VlO80_MRKj3c1DJD6XFEOVHRCsNksk8OjJV-PbHJHQ"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veraflor.vercel.app" />
        <meta
          property="og:image"
          content="https://veraflor.vercel.app/images/pelotas.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta
          name="twitter:image"
          content="https://veraflor.vercel.app/images/pelotas.png"
        />

        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className={`${inter.className} layout`}>
        <Providers>
        <AdministradorProvider>
          <ClienteProvider>
            <Header />
            <div className="main-content">
              <main className="content">{children}</main>
            </div>
            <Footer />
          </ClienteProvider>
        </AdministradorProvider>
        </Providers>
      </body>
    </html>
  );
}
