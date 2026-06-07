"use client";

import { SessionProvider } from "next-auth/react";
import { LocaleSync } from "./LocaleSync";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LocaleSync />
      {children}
    </SessionProvider>
  );
}
