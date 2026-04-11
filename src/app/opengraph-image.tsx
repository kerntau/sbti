import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #111827 56%, #1e293b 100%)',
          color: '#f8fafc',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(59,130,246,0.35), transparent 32%), radial-gradient(circle at bottom right, rgba(249,115,22,0.28), transparent 30%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            padding: '64px 72px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: 6, color: '#93c5fd' }}>
              SBTI PERSONA TEST
            </div>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 900, lineHeight: 1.04, maxWidth: 760 }}>
              28 道题，拆出你更真实的人格节奏
            </div>
            <div style={{ display: 'flex', fontSize: 34, lineHeight: 1.45, color: 'rgba(226,232,240,0.9)', maxWidth: 780 }}>
              不只是给你四个字母，而是把能量、感知、决策和行动节奏讲清楚。
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18 }}>
            {['28 题', '16 型', '可分享结果图'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  padding: '18px 28px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
