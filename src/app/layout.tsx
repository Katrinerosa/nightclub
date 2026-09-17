import type { Metadata } from "next";
import "./globals.css";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "NightClub",
  description: "Explore NightClub events, discover the gallery and reserve a table for your next night out.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
           <Footer />
          <GoogleAnalytics />
      </body>
    </html>
  );
}
