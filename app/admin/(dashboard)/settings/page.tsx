import { getSettings, parseHeroSlides } from "@/server/queries";
import { SettingsForm } from "./SettingsForm";
import { HeroSlidesManager } from "./HeroSlidesManager";

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  const heroSlides = parseHeroSlides(settings?.heroSlides);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">الإعدادات</h1>
      <div className="space-y-10">
        <SettingsForm settings={settings} />
        <HeroSlidesManager initialSlides={heroSlides} />
      </div>
    </div>
  );
}
