import type { Metadata } from "next";
import { Navbar, NavbarLogo } from "@/components/ui/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "devroast — paste your code. get roasted.",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg-page font-sans text-text-primary">
        <Navbar>
          <NavbarLogo />
          <a
            href="/leaderboard"
            className="cursor-pointer font-mono text-sm text-text-secondary transition-colors hover:text-text-primary"
          >
            leaderboard
          </a>
        </Navbar>
        {children}
      </body>
    </html>
  );
}
