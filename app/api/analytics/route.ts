import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackEvent } from "@/server/analytics";

const schema = z.object({
  type: z.string().min(1).max(50),
  path: z.string().max(500).optional(),
  productId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid" }, { status: 400 });
    }

    await trackEvent(
      parsed.data.type,
      parsed.data.path,
      parsed.data.productId
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
