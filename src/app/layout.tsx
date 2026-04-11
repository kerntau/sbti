import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#e8e6e1',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'IMSB 人格测试',
  description: '30 道题，十五维人格测试，给你一份可读、可分享的人格分析报告。',
  keywords: ['IMSB', '人格测试', '性格测试', '性格评估', '心理测评'],
  applicationName: 'IMSB',
  openGraph: {
    title: 'IMSB 人格测试',
    description: '30 道题，十五维人格测试。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IMSB 人格测试',
    description: '30 道题，十五维人格测试。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="zh-CN" className={bodyFont.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
