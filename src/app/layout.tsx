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
  title: 'SBTI 认知偏好评估',
  description: '28 道题，四维认知偏好评估，给你一份可读、可分享的人格分析报告。',
  keywords: ['SBTI', '人格测试', '认知偏好', '性格评估', '心理测评'],
  applicationName: 'SBTI',
  openGraph: {
    title: 'SBTI 认知偏好评估',
    description: '28 道题，拆解你的四维认知偏好。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBTI 认知偏好评估',
    description: '28 道题，四维认知偏好评估报告。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={bodyFont.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
