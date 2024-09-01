import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AdministradorProvider from "@/contexts/administrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veraflor Garden - Floricultura e Jardinagem",
  description: "Explore a variedade de plantas, flores e acessórios de jardinagem da Veraflor Garden.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="description" content={metadata.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veraflor.vercel.app" />
        <meta property="og:image" content="/images/pelotas.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/images/pelotas.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Florist",
              "name": "Veraflor Garden",
              "description": "Explore a variedade de plantas, flores e acessórios de jardinagem da Veraflor Garden.",
              "image": "https://veraflor.vercel.app/images/pelotas.png",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Dr. Félix Antônio Caputo, 251",
                "addressLocality": "Pelotas",
                "addressRegion": "RS",
                "postalCode": "96070-060",
                "addressCountry": "BR"
              },
              "telephone": "+55-(53)99956-1458",
              "sameAs": [
                "https://www.facebook.com/veraflorgarden",
                "https://www.instagram.com/veraflorgarden"
              ],
              "url": "https://veraflor.vercel.app"
            }
          `}
        </script>
      </head>
      <body className={`${inter.className} layout`}>
        <AdministradorProvider>
          <Header />
          <div className="main-content">
            <main className="content">{children}</main>
          </div>
          <Footer />
        </AdministradorProvider>
      </body>
    </html>
  );
}
