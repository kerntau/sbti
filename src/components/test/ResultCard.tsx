'use client';

import Image from 'next/image';
import { TestResult, DimensionResult } from '@/types';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import { typeImageMap, typeRarity, getRarityLabel, getRarityColor } from '@/data/type-images';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ResultCardProps {
  result: TestResult;
}

const LEVEL_DOT: Record<string, { color: string; label: string; val: number }> = {
  L: { color: '#94a3b8', label: '低', val: 1 },
  M: { color: '#f59e0b', label: '中', val: 2 },
  H: { color: '#22c55e', label: '高', val: 3 },
};

function shortName(name: string) {
  return name.replace(/^[A-Za-z]+\d?\s*/, '');
}

export default function ResultCard({ result }: ResultCardProps) {
  const displayName = getProfileDisplayName(result.profile);
  const hasAvatar = Boolean(result.profile?.avatarUrl);
  
  const dateStr = new Date(result.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const durationMin = Math.floor(result.durationMs / 60000);
  const durationSec = Math.round((result.durationMs % 60000) / 1000);
  const typeCode = result.finalType.code;
  const imgSrc = typeImageMap[typeCode];
  const rarity = typeRarity[typeCode];
  const rarityLabel = rarity != null ? getRarityLabel(rarity) : null;
  const rarityColor = rarity != null ? getRarityColor(rarity) : '#888';

  // 分组模型以便生成图表
  const modelGroups = result.dimensions.reduce<Record<string, DimensionResult[]>>((acc, dim) => {
    if (!acc[dim.model]) acc[dim.model] = [];
    acc[dim.model].push(dim);
    return acc;
  }, {});

  // 生成雷达图数据
  const radarData = Object.entries(modelGroups).map(([model, dims]) => {
    const valSum = dims.reduce((sum, dim) => sum + (LEVEL_DOT[dim.level]?.val ?? 2), 0);
    const avg = valSum / dims.length;
    return {
      subject: model.replace('模型', ''),
      value: Number(avg.toFixed(1)),
      fullMark: 3,
    };
  });

  return (
    <article id="result-report-card" className="relative bg-white text-gray-900 mx-auto max-w-3xl px-8 py-12 sm:px-16 sm:py-20 overflow-hidden shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
      {/* 纹理背景或通知书水印 */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }} />
      
      {/* 通知书抬头 */}
      <header className="flex justify-between items-end border-b-4 border-black pb-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">IMSB Assessment</h1>
          <p className="text-sm font-semibold text-gray-500 tracking-[0.2em] mt-2">综合人格评估报告</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1 inline-block mb-2">OFFICIAL & CONFIDENTIAL</p>
          <p className="font-mono text-sm text-gray-600 block">{dateStr}</p>
        </div>
      </header>

      {/* 参测者基本信息 */}
      <div className="flex items-center gap-6 bg-gray-50/80 border border-gray-200 p-6 mb-12">
        <div className="relative w-20 h-20 bg-gray-200 flex-shrink-0 border bg-white border-gray-300 shadow-sm">
          {hasAvatar ? (
            <Image src={result.profile!.avatarUrl!} alt={displayName} fill sizes="80px" className="object-cover grayscale hover:grayscale-0 transition-all duration-700" crossOrigin="anonymous" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
               {getProfileInitial(result.profile)}
             </div>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <div className="flex gap-4 items-baseline">
            <span className="text-xs font-bold text-gray-400 w-16 shrink-0 uppercase tracking-widest">Client ID</span>
            <span className="text-lg font-black">{displayName}</span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-xs font-bold text-gray-400 w-16 shrink-0 uppercase tracking-widest">Connect</span>
            <span className="text-sm font-mono text-gray-700">{result.profile?.qq || 'N/A'}</span>
          </div>
          <div className="flex gap-4 items-baseline">
            <span className="text-xs font-bold text-gray-400 w-16 shrink-0 uppercase tracking-widest">Duration</span>
            <span className="text-sm font-mono text-gray-700">{durationMin > 0 ? `${durationMin}m ` : ''}{durationSec}s</span>
          </div>
        </div>
        
        {/* 右侧盖章效果 */}
        <div className="hidden sm:flex flex-col items-center justify-center pr-6">
          <div className="w-20 h-20 rounded-full border-[4px] border-red-700/80 text-red-700/80 font-black flex items-center justify-center transform -rotate-12 opacity-80">
            <span className="text-xs tracking-[0.2em] block text-center leading-tight">REVIEWED<br/>& VERIFIED</span>
          </div>
        </div>
      </div>

      {/* 核心结论区 */}
      <section className="mb-14 flex flex-col md:flex-row gap-10 items-center justify-center border border-gray-200 py-10 px-8 bg-white relative z-10">
        <div className="w-56 h-56 sm:w-64 sm:h-64 relative flex-shrink-0 mix-blend-multiply">
          {imgSrc ? (
            <Image src={imgSrc} alt={typeCode} fill sizes="256px" className="object-contain" priority crossOrigin="anonymous" />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-sm font-bold tracking-widest">NO IMAGE</div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left flex flex-col justify-center">
          <p className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase mb-3">{result.modeKicker} / {result.badge}</p>
          <h2 className="text-6xl font-black tracking-tighter mb-4 text-gray-900">{typeCode}</h2>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{result.finalType.cn}</h3>
          <p className="text-base font-medium text-gray-600 italic border-l-4 border-gray-300 pl-4 mb-6 leading-relaxed text-left">
            「{result.finalType.intro}」
          </p>
          {rarityLabel && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-gray-200 text-xs font-bold font-mono text-gray-600 self-start mx-auto md:mx-0">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: rarityColor }}></span>
              {rarityLabel.toUpperCase()} (RARITY: {rarity}%)
            </div>
          )}
        </div>
      </section>

      {/* 解读说明与图表左右/上下布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
        {/* 解读说明 */}
        <section>
          <h4 className="text-xs font-black text-black border-b-2 border-gray-200 pb-3 mb-6 uppercase tracking-[0.2em]">结论陈述 / Conclusion</h4>
          <div className="text-[15px] leading-[1.8] text-gray-700 whitespace-pre-line space-y-5 font-medium text-justify">
            <p>{result.finalType.desc}</p>
            {result.sub && <p className="text-gray-500 mt-4 bg-gray-50 p-4 italic text-sm border-l-2 border-gray-300">{result.sub}</p>}
          </div>
        </section>

        {/* 图表展示区 */}
        <section>
          <h4 className="text-xs font-black text-black border-b-2 border-gray-200 pb-3 mb-6 uppercase tracking-[0.2em]">模型透视 / Radar Analysis</h4>
          <div className="h-72 w-full bg-gray-50/50 border border-gray-100 flex items-center justify-center p-4">
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 3]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#111827"
                  strokeWidth={2.5}
                  fill="#111827"
                  fillOpacity={0.12}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section>
        <h4 className="text-xs font-black text-black border-b-2 border-gray-200 pb-3 mb-8 uppercase tracking-[0.2em]">指标明细 / Technical Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
          {Object.entries(modelGroups).map(([model, dims]) => (
            <div key={model}>
              <h5 className="text-sm font-black text-gray-800 mb-4 border-b border-gray-100 pb-2">{model.replace('模型', '')}</h5>
              <div className="space-y-3">
                {dims.map((dim) => (
                  <div key={dim.dim} className="flex items-center justify-between group">
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-black transition-colors">{shortName(dim.name)}</span>
                    <span className="text-xs font-mono font-bold w-10 py-0.5 text-center rounded bg-gray-100 border border-gray-200" style={{ color: LEVEL_DOT[dim.level].color }}>
                      {LEVEL_DOT[dim.level].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 底部声明 */}
      <footer className="mt-20 pt-8 border-t-2 font-mono border-black text-center text-xs text-gray-400 space-y-1.5">
        <p className="font-bold text-gray-500 tracking-widest">IMSB ASSESSMENT SYSTEM v2.0</p>
        <p>Auto-generated report. Valid exclusively for the assessed individual.</p>
        <p>Not intended for clinical diagnosis. For reference purposes only.</p>
        <p className="mt-4">- END OF REPORT -</p>
      </footer>
    </article>
  );
}

