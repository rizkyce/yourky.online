import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { IntroWrapper } from "@/components/layout/IntroWrapper";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nur Ridho Rizki - Computer Engineer",
    template: "%s | Nur Ridho Rizki",
  },
  description:
    "Personal portfolio of Nur Ridho Rizki — a Computer Engineering graduate specializing in IoT systems, cloud infrastructure, VSAT network, and deep learning applications.",
  keywords: [
    "vsat operator",
    "portfolio",
    "iot developer",
    "computer engineer",
    "cloud computing",
    "deep learning",
    "python",
    "lorawan",
  ],
  authors: [{ name: "Nur Ridho Rizki" }],
  openGraph: {
    title: "Nur Ridho Rizki",
    description:
      "Personal portfolio of Nur Ridho Rizki — specializing in IoT, cloud infrastructure, and AI-powered solutions.",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <AnalyticsTracker />
          <ThemeProvider>
            {/* Intro Overlay + Main Content */}
            <IntroWrapper>
              <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Mobile Navigation */}
                <MobileNav />

                {/* Main Content */}
                <main className="flex-1 lg:ml-[280px] w-full min-h-screen overflow-x-hidden">
                  <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 py-8 pt-20 lg:pt-8 pb-24 lg:pb-8 box-border">
                    {children}
                  </div>
                </main>
              </div>
            </IntroWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
