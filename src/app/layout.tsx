import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "AssetFlow",
  description: "AssetFlow is a platform for managing your assets.",
  icons: [{ rel: "icon", url: "/logo.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
