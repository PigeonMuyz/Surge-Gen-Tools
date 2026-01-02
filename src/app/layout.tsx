import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surge 配置生成器",
  description: "WebUI for generating customized Surge configuration files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
