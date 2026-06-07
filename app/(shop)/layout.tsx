import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSettings } from "@/server/queries";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        logo={settings?.logo}
        storeName={settings?.storeName ?? "Hit | هيت"}
      />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={settings?.storeName ?? "Hit | هيت"}
        tagline={settings?.tagline ?? "أكل قطعة ذكرى"}
        mapLink={settings?.mapLink}
        jahezLink={settings?.jahezLink}
        hungerStationLink={settings?.hungerStationLink}
        toYouLink={settings?.toYouLink}
        instagramLink={settings?.instagramLink}
        snapchatLink={settings?.snapchatLink}
        tiktokLink={settings?.tiktokLink}
        kitalink={settings?.kitalink}
        theChefzLink={settings?.theChefzLink}
      />
    </div>
  );
}