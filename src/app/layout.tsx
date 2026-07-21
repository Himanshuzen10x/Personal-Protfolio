import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Himanshu Kumar | Full Stack Developer Portfolio",
  description:
    "Personal portfolio of Himanshu Kumar — Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. View projects, skills, and experience.",
  keywords: [
    "full stack developer",
    "portfolio",
    "react",
    "next.js",
    "node.js",
    "web developer",
    "software engineer",
  ],
  authors: [{ name: "Himanshu Kumar" }],
  openGraph: {
    title: "Himanshu Kumar | Full Stack Developer",
    description: "Personal portfolio showcasing projects, skills, and experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="footer">
          <div className="footer-links">
            <a href="https://github.com/himanshuzen10x" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://linkedin.com/in/himanshu-kumar" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="/contact">Contact</a>
          </div>
          <p>
            © {new Date().getFullYear()} Himanshu Kumar. Built with Next.js •
            Inspired by Codeforces
          </p>
        </footer>
      </body>
    </html>
  );
}
