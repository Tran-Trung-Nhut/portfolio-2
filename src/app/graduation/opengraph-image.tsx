import { ImageResponse } from 'next/og';
import { GRADUATION_CONFIG } from '@/shared/graduationConfig';

export const alt = 'Thư mời Lễ Tốt nghiệp – Trần Trung Nhựt';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const COLORS = {
  bg: '#0b0d17',
  panel: '#151833',
  panel2: '#111327',
  border: 'rgba(59, 130, 246, 0.3)',
  heading: '#ffffff',
  muted: '#cbd5e1',
  dim: '#94a3b8',
  keyword: '#60a5fa',
  string: '#22d3ee',
  dot: 'rgba(96, 165, 250, 0.4)',
};

const TEXT = {
  file: 'thiep_moi.ts',
  tag: 'BÁCH KHOA · KHMT',
  prompt: 'npm run tot-nghiep',
  lead: 'Trân trọng kính mời bạn đến dự',
  title: 'Lễ Tốt nghiệp',
  name: 'Trần Trung Nhựt',
  major: 'Cử nhân Khoa học Máy tính',
  school: '// Trường Đại học Bách khoa – ĐHQG-HCM',
  venue: `@ ${GRADUATION_CONFIG.diaDiem}`,
};

const loadGoogleFont = async (family: string, weight: number, text: string) => {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!resource) throw new Error(`Font not found: ${family} ${weight}`);
  const response = await fetch(resource[1]);
  if (!response.ok) throw new Error(`Font download failed: ${family} ${weight}`);
  return response.arrayBuffer();
};

const loadFonts = async () => {
  const allText = Object.values(TEXT).join(' ') + '$';
  try {
    const [light, bold, mono] = await Promise.all([
      loadGoogleFont('Inter', 300, allText),
      loadGoogleFont('Inter', 700, allText),
      loadGoogleFont('JetBrains+Mono', 400, allText),
    ]);
    return [
      { name: 'Inter', data: light, weight: 300 as const, style: 'normal' as const },
      { name: 'Inter', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'JetBrains Mono', data: mono, weight: 400 as const, style: 'normal' as const },
    ];
  } catch (error) {
    console.warn('[graduation og:image] Could not load Google Fonts:', error);
    return undefined;
  }
};

export default async function Image() {
  const fonts = await loadFonts();
  const mono = 'JetBrains Mono';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 48,
          backgroundColor: COLORS.bg,
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.16) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
          fontFamily: 'Inter',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: `2px solid ${COLORS.border}`,
            borderRadius: 28,
            backgroundColor: COLORS.panel2,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '20px 32px',
              backgroundColor: COLORS.panel,
              borderBottom: `2px solid ${COLORS.border}`,
              fontFamily: mono,
            }}
          >
            <div style={{ display: 'flex', gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.dot }} />
              ))}
            </div>
            <div style={{ fontSize: 22, color: COLORS.muted }}>{TEXT.file}</div>
            <div style={{ marginLeft: 'auto', fontSize: 18, letterSpacing: 2, color: COLORS.dim }}>{TEXT.tag}</div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 64px' }}>
            <div style={{ display: 'flex', fontFamily: mono, fontSize: 24, color: COLORS.dim }}>
              <span style={{ color: COLORS.keyword, marginRight: 14 }}>$</span>
              {TEXT.prompt}
            </div>
            <div style={{ marginTop: 22, fontSize: 34, fontWeight: 300, color: COLORS.muted }}>{TEXT.lead}</div>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
              <div style={{ fontSize: 104, fontWeight: 700, lineHeight: 1.15, letterSpacing: -2, color: COLORS.heading }}>
                {TEXT.title}
              </div>
              <div style={{ width: 44, height: 104, marginLeft: 20, backgroundColor: COLORS.keyword }} />
            </div>
            <div style={{ display: 'flex', marginTop: 10, fontSize: 36, color: COLORS.muted }}>
              <span style={{ fontWeight: 700, color: COLORS.heading }}>{TEXT.name}</span>
              <span style={{ fontWeight: 300, margin: '0 16px' }}>–</span>
              <span style={{ fontWeight: 300 }}>{TEXT.major}</span>
            </div>
            <div style={{ display: 'flex', marginTop: 30, fontFamily: mono, fontSize: 24 }}>
              <span style={{ color: COLORS.dim }}>{TEXT.school}</span>
              <span style={{ marginLeft: 'auto', color: COLORS.string }}>{TEXT.venue}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
