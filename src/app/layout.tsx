import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata: Metadata = {
  title: "D365 UAT Coach — AI-Powered Testing Assistant",
  description:
    "An AI chatbot that coaches non-technical finance end-users through User Acceptance Testing for Microsoft Dynamics 365 Finance & Operations.",
  keywords: [
    "D365",
    "Dynamics 365",
    "UAT",
    "User Acceptance Testing",
    "Finance",
    "ERP",
    "AI Coach",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
