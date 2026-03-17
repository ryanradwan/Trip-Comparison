import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import BackButton from "@/components/BackButton";
import IframeResizer from "@/components/IframeResizer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trip Comparison Engine | The Next Stamp Travel Co.",
  description: "Compare any two travel destinations side by side — personalized to your travel style, budget, and priorities.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://compare.thenextstamptravelco.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: "var(--bg-page)" }}>
        <nav
          style={{
            backgroundColor: "var(--bg-card)",
            borderBottom: "1px solid var(--border-light)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1024,
              margin: "0 auto",
              padding: "0 16px",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: 18,
                textDecoration: "none",
              }}
            >
              Trip Comparison
            </Link>
            <BackButton />
          </div>
        </nav>

        <IframeResizer />
        {children}

        <footer
          style={{
            borderTop: "1px solid var(--border-light)",
            backgroundColor: "var(--bg-card)",
            marginTop: 80,
            padding: "32px 16px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "0 0 8px" }}>
            A tool by{" "}
            <a
              href={process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://thenextstamptravelco.com"}
              style={{ color: "var(--accent-primary)", textDecoration: "none" }}
            >
              The Next Stamp Travel Co.
            </a>
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/faq" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>FAQ</Link>
            <Link href="/destinations" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>All Destinations</Link>
            <a href="https://thenextstamptravelco.com/contact" style={{ fontSize: 12, color: "var(--text-muted)", textDecoration: "none" }}>Contact</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
