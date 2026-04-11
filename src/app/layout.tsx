import type { Metadata } from 'next';
import { DM_Sans, Manrope } from 'next/font/google';
import './globals.css';

const headingFont = Manrope({
  subsets: ['latin'],
  variable: '--font-heading',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'SBTI 人格测试',
  description: '28 道题，拆出你的四维人格偏好，给你一个更好懂也更好分享的人格结论。',
  keywords: ['SBTI', '人格测试', 'MBTI', '趣味测试', '性格测试'],
  applicationName: 'SBTI 人格测试',
  openGraph: {
    title: 'SBTI 人格测试',
    description: '不是只给你四个字母，而是把人格倾向拆开讲明白。',
    type: 'website',
    locale: 'zh_CN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBTI 人格测试',
    description: '28 道题，拆出你的四维人格偏好。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${headingFont.variable} ${bodyFont.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
