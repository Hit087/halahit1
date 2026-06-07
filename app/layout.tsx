import type { Metadata, Viewport } from "next";
import { Noto_Sans_Arabic, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { getSettings } from "@/server/queries";
import "./globals.css";

export const dynamic = "force-dynamic";

const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

async function safeGetSettings() {
  try {
    const settings = await getSettings();
    return (
      settings ?? {
        storeName: "Hit | هيت",
        tagline: "لكل قطعة ذكرى",
      }
    );
  } catch (e) {
    return {
      storeName: "Hit | هيت",
      tagline: "لكل قطعة ذكرى",
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeGetSettings();

  return {
    title: {
      default: settings.storeName,
      template: `%s | ${settings.storeName}`,
    },
    description: settings.tagline,
    manifest: "/manifest.json",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: settings.storeName,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#F4A6C1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${arabic.variable} ${display.variable} font-arabic`}>
        <Providers>
          <PageViewTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}