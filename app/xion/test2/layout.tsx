'use client'
import type { Metadata } from "next";
import "@/app/globals.css";
import "@burnt-labs/ui/styles.css";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";

export const metadata: Metadata = {
  title: "Xion Account Dashboard",
  description: "A dashboard for managing Xion accounts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AbstraxionProvider
      config={{
        contracts: [
          "xion1z70cvc08qv5764zeg3dykcyymj5z6nu4sqr7x8vl4zjef2gyp69s9mmdka",
        ],
      }}
    >
      <div className="ui-flex">{children}</div>
    </AbstraxionProvider>
  );
}
