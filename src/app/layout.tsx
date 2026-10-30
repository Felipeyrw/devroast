import type { Metadata } from "next";
import { NavbarNavigation } from "@/components/navbar-navigation";
import { Navbar, NavbarLogo } from "@/components/ui/navbar";
import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";

export const metadata: Metadata = {
  title: "devroast — paste your code. get roasted.",
  description:
    "Drop your code below and we'll rate it — brutally honest or full roast mode.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-bg-page font-sans text-text-primary">
        <TRPCReactProvider>
          <Navbar>
            <NavbarLogo />
            <NavbarNavigation />
          </Navbar>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
