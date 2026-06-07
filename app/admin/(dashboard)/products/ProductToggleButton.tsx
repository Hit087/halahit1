"use client";

import { toggleProductActive } from "@/server/actions/admin-products";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function ProductToggleButton({
  id,
  active,
}: {
  id: string;
  active: boolean;
}) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await toggleProductActive(id, !active);
        router.refresh();
      }}
    >
      {active ? "تعطيل" : "تفعيل"}
    </Button>
  );
}
