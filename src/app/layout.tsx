import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ScrollToTopButton } from "@/components/shared/ScrollToTopButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "DevLink | Developer Hub",
    template: "%s | DevLink",
  },
  description:
    "DevLink adalah platform untuk berbagi artikel teknikal dan code snippet untuk developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <ThemeProvider>
          <Providers>{children}</Providers>
          <ScrollToTopButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
