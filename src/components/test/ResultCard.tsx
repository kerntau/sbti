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
  const hasProfile = Boolean(result.profile?.nickname || result.profile?.qq);
  
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
    <article className="relative bg-white text-gray-900 mx-auto max-w-2xl px-6 py-10 sm:px-12 sm:py-16 overflow-hidden rounded-none shadow-sm" style={{ border: '1px solid #e5e7eb' }}>
      {/* 纹理背景或通知书水印 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      
      {/* 通知书抬头 */}
      <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase">IMSB Assessment</h1>
          <p className="text-sm font-medium text-gray-500 tracking-widest mt-1">综合人格评估报告（正式版）</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-gray-500 border border-gray-300 px-2 py-0.5 inline-block">CONFIDENTIAL</p>
          <p className="font-mono text-xs text-gray-500 mt-2">{dateStr}</p>
        </div>
      </header>

      {/* 参测者基本信息 */}
      <div className="flex items-center gap-4 bg-gray-50/80 border border-gray-200 p-4 mb-8">
        <div className="relative w-16 h-16 bg-gray-200 flex-shrink-0 border border-gray-300">
          {hasAvatar ? (
            <Image src={result.profile!.avatarUrl!} alt={displayName} fill sizes="64px" className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
               {getProfileInitial(result.profile)}
             </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex gap-2 items-baseline mb-1">
            <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">代号/ID</span>
            <span className="text-base font-bold">{displayName}</span>
          </div>
          <div className="flex gap-2 items-baseline mb-1">
            <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">联系QQ</span>
            <span className="text-sm font-mono">{result.profile?.qq || '未提供'}</span>
          </div>
          <div className="flex gap-2 items-baseline">
            <span className="text-xs font-semibold text-gray-500 w-12 shrink-0">耗时</span>
            <span className="text-sm font-mono">{durationMin > 0 ? `${durationMin}m ` : ''}{durationSec}s</span>
          </div>
        </div>
        
        {/* 右侧盖章效果 */}
        <div className="hidden sm:flex flex-col items-center justify-center pr-4">
          <div className="w-16 h-16 rounded-full border-[3px] border-red-600/80 text-red-600/80 font-bold flex items-center justify-center transform -rotate-12">
            <span className="text-xs tracking-widest block text-center leading-tight">REVIEWED<br/>DONE</span>
          </div>
        </div>
      </div>

      {/* 核心结论区 */}
      <section className="mb-10 flex flex-col md:flex-row gap-8 items-center border border-gray-200 p-6 bg-white relative z-10">
        <div className="w-48 h-48 sm:w-56 sm:h-56 relative flex-shrink-0 mix-blend-multiply">
          {imgSrc ? (
            <Image src={imgSrc} alt={typeCode} fill sizes="224px" className="object-contain" priority />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">暂无图鉴</div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">{result.modeKicker} / {result.badge}</p>
          <h2 className="text-5xl font-black tracking-tighter mb-2">{typeCode}</h2>
          <h3 className="text-xl font-bold text-gray-800 mb-3">{result.finalType.cn}</h3>
          <p className="text-sm font-medium text-gray-600 italic border-l-4 border-gray-300 pl-3 mb-4 text-left">
            「{result.finalType.intro}」
          </p>
          {rarityLabel && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rarityColor }}></span>
              {rarityLabel} (稀有度: {rarity}%)
            </div>
          )}
        </div>
      </section>

      {/* 解读说明 */}
      <section className="mb-12">
        <h4 className="text-sm font-bold text-black border-b border-gray-200 pb-2 mb-4 uppercase tracking-widest">结论陈述 / Conclusion</h4>
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line space-y-4 font-medium">
          <p>{result.finalType.desc}</p>
          {result.sub && <p className="text-gray-500 mt-2 bg-gray-50 p-3 italic text-xs">{result.sub}</p>}
        </div>
      </section>

      {/* 图表展示区 */}
      <section className="mb-10">
        <h4 className="text-sm font-bold text-black border-b border-gray-200 pb-2 mb-6 uppercase tracking-widest">五维模型透视图 / Radar Chart</h4>
        <div className="h-64 sm:h-72 w-full bg-gray-50 border border-gray-100 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={90} domain={[1, 3]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#111827"
                strokeWidth={2}
                fill="#111827"
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h4 className="text-sm font-bold text-black border-b border-gray-200 pb-2 mb-4 uppercase tracking-widest">指标明细 / Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          {Object.entries(modelGroups).map(([model, dims]) => (
            <div key={model}>
              <h5 className="text-xs font-bold text-gray-500 mb-2">{model.replace('模型', '')}</h5>
              <div className="space-y-1.5">
                {dims.map((dim) => (
                  <div key={dim.dim} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
                    <span className="text-xs font-medium text-gray-800">{shortName(dim.name)}</span>
                    <span className="text-xs font-mono font-bold w-6 text-center rounded bg-gray-100" style={{ color: LEVEL_DOT[dim.level].color }}>
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
      <footer className="mt-16 pt-6 border-t font-mono border-gray-200 text-center text-[10px] text-gray-400">
        <p>This report is auto-generated by the IMSB Assessment System.</p>
        <p>Valid exclusively for the assessed individual. Not intended for clinical diagnosis.</p>
        <p className="mt-2">- EOF -</p>
      </footer>
    </article>
  );
}

