import type { Metadata } from "next";
import localFont from "next/font/local";
import {  XionProviders } from "../../providers";
import "@/app/globals.css";
import "@burnt-labs/ui/styles.css";



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
        <XionProviders>
          <div className="ui-flex">{children}</div>
        </XionProviders>
  );
}
