import { Header } from "./Header";
import { Footer } from "./Footer";
import Head from "next/head";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Layout({ 
  children, 
  title = "Shrink - URL Shortener",
  description = "A simple and efficient URL shortener service"
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/shrlink-ok-m9kd6d9h.png" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow bg-gray-50">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}