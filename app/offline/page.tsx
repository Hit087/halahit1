import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center" dir="rtl">
      <h1 className="font-display text-4xl font-bold text-text">أنت غير متصل</h1>
      <p className="mt-4 text-text/60">تحقق من اتصالك بالإنترنت وحاول مرة أخرى</p>
      <Link href="/" className="mt-8">
        <Button variant="accent">العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
