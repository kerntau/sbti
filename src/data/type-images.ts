// 27 种人格的图鉴图片路径映射（对应 /public/images/types/）
export const typeImageMap: Record<string, string> = {
  'CTRL': '/images/types/CTRL.png',
  'ATM-er': '/images/types/ATM-er.png',
  'Dior-s': '/images/types/Dior-s.jpg',
  'BOSS': '/images/types/BOSS.png',
  'THAN-K': '/images/types/THAN-K.png',
  'OH-NO': '/images/types/OH-NO.png',
  'GOGO': '/images/types/GOGO.png',
  'SEXY': '/images/types/SEXY.png',
  'LOVE-R': '/images/types/LOVE-R.png',
  'MUM': '/images/types/MUM.png',
  'FAKE': '/images/types/FAKE.png',
  'OJBK': '/images/types/OJBK.png',
  'MALO': '/images/types/MALO.png',
  'JOKE-R': '/images/types/JOKE-R.jpg',
  'WOC!': '/images/types/WOC.png',
  'THIN-K': '/images/types/THIN-K.png',
  'SHIT': '/images/types/SHIT.png',
  'ZZZZ': '/images/types/ZZZZ.png',
  'POOR': '/images/types/POOR.png',
  'MONK': '/images/types/MONK.png',
  'IMSB': '/images/types/IMSB.png',
  'SOLO': '/images/types/SOLO.png',
  'FUCK': '/images/types/FUCK.png',
  'DEAD': '/images/types/DEAD.png',
  'IMFW': '/images/types/IMFW.png',
  'HHHH': '/images/types/HHHH.png',
  'DRUNK': '/images/types/DRUNK.png',
};

// 稀有度数据
export const typeRarity: Record<string, number> = {
  'CTRL': 3.61,
  'ATM-er': 2.46,
  'Dior-s': 5.23,
  'BOSS': 1.53,
  'THAN-K': 7.76,
  'OH-NO': 3.05,
  'GOGO': 3.05,
  'SEXY': 5.94,
  'LOVE-R': 4.23,
  'MUM': 5.14,
  'FAKE': 6.61,
  'OJBK': 9.92,
  'MALO': 5.71,
  'JOKE-R': 2.99,
  'WOC!': 2.04,
  'THIN-K': 2.24,
  'SHIT': 2.53,
  'ZZZZ': 4.68,
  'POOR': 1.68,
  'MONK': 2.8,
  'IMSB': 4.21,
  'SOLO': 3.72,
  'FUCK': 3.38,
  'DEAD': 2.5,
  'IMFW': 2.12,
  'HHHH': 0.06,
  'DRUNK': 0.8,
};

export function getRarityLabel(pct: number): string {
  if (pct <= 1) return '极稀有';
  if (pct <= 2) return '稀有';
  if (pct <= 4) return '中等';
  return '较常见';
}

export function getRarityColor(pct: number): string {
  if (pct <= 1) return '#f59e0b';
  if (pct <= 2) return '#a855f7';
  if (pct <= 4) return '#3b82f6';
  return '#6b7280';
}
