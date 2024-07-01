import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import AdministradorProvider from "@/contexts/administrator";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Veraflor Garden",
  description: "Floricultura Veraflor Garden",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
