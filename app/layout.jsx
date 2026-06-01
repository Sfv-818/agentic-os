import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import Background from "@/components/Background";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "Agentic OS · Mission Control",
  description: "Your personal AI operating system. Local-first command center for Claude and your agents.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable}`}>
      <body>
        <Background />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
