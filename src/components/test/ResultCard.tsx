'use client';

import Image from 'next/image';
import { TestResult, DimensionResult } from '@/types';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import { typeImageMap, typeRarity, getRarityLabel, getRarityColor } from '@/data/type-images';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface ResultCardProps {
  result: TestResult;
}

const LEVEL_DOT: Record<string, { label: string; val: number; barClass: string }> = {
  L: { label: 'LOW', val: 1, barClass: 'bg-gray-300 w-1/3' },
  M: { label: 'MID', val: 2, barClass: 'bg-gray-500 w-[66%]' },
  H: { label: 'HIGH', val: 3, barClass: 'bg-black w-full' },
};

function shortName(name: string) {
  return name.replace(/^[A-Za-z]+\d?\s*/, '');
}

const Barcode = ({ text }: { text: string }) => {
  const getLine = (i: number) => {
    const w = ((text.charCodeAt(i % text.length) * 11) % 4) + 1;
    const mr = ((text.charCodeAt((i + 1) % text.length) * 7) % 3) + 1;
    return <div key={i} className="bg-black h-8 shrink-0" style={{ width: `${w}px`, marginRight: `${mr}px` }} />;
  };
  return (
    <div className="flex flex-col items-end">
      <div className="flex h-8 items-center bg-white">
        {Array.from({ length: 32 }).map((_, i) => getLine(i))}
      </div>
      <span className="text-[9px] font-mono tracking-widest text-gray-500 mt-1">{text.toUpperCase()}</span>
    </div>
  );
};

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

  const reportId = `IMSB-${result.completedAt.toString().slice(-6)}-${typeCode}`;

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

  // 获取一段文字总结（取第一段）
  const firstParagraph = result.finalType.desc.split('\n').map(p => p.trim()).filter(Boolean)[0] || '';

  return (
    <article 
      id="result-report-card" 
      className="relative bg-white text-black mx-auto w-full max-w-[800px] overflow-hidden shadow-sm selection:bg-gray-200"
    >
      {/* 极简纸张质感 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      {/* 顶部主标题栏 */}
      <header className="p-6 sm:p-8 pb-4 flex justify-between items-end border-b-2 border-black">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none">IMSB EVALUATION</h1>
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-500 mt-2 uppercase">Official Clinical Report</p>
        </div>
        <div className="hidden sm:block">
          <Barcode text={reportId} />
        </div>
      </header>

      {/* 病历基本信息/元数据栏 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-300 text-[10px] font-mono tracking-wider divide-x divide-gray-300">
        <div className="px-6 sm:px-8 py-2.5 flex flex-col justify-center">
          <span className="text-gray-400">PATIENT / ID</span>
          <span className="font-bold text-xs uppercase truncate">{displayName}</span>
        </div>
        <div className="px-6 sm:px-8 py-2.5 flex flex-col justify-center">
          <span className="text-gray-400">DATE</span>
          <span className="font-bold text-xs">{dateStr}</span>
        </div>
        <div className="px-6 sm:px-8 py-2.5 flex flex-col justify-center">
          <span className="text-gray-400">DURATION</span>
          <span className="font-bold text-xs">{durationMin > 0 ? `${durationMin}m ` : ''}{durationSec}s</span>
        </div>
        <div className="px-6 sm:px-8 py-2.5 flex flex-col justify-center bg-gray-50/50">
          <span className="text-gray-400">RARITY</span>
          <span className="font-bold text-xs">{rarity}%</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* 核心结果横幅：图腾、代号与文字总结 */}
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
          {/* 左侧头像和图腾 */}
          <div className="w-full md:w-1/3 flex flex-col gap-3">
            <div className="aspect-square relative border border-gray-200 bg-gray-50 flex items-center justify-center p-2">
              {imgSrc ? (
                <Image src={imgSrc} alt={typeCode} fill sizes="(max-width: 768px) 100vw, 300px" className="object-contain mix-blend-multiply opacity-90 p-4" priority crossOrigin="anonymous" />
              ) : (
                <div className="text-gray-300 text-xs font-mono">NO IMAGE</div>
              )}
              {/* 叠加小头像 */}
              <div className="absolute -bottom-3 -right-3 w-14 h-14 sm:w-16 sm:h-16 bg-white border border-gray-300 shadow-sm flex items-center justify-center overflow-hidden z-10 hidden sm:flex">
                {hasAvatar ? (
                  <Image src={result.profile!.avatarUrl!} alt={displayName} fill sizes="64px" className="object-cover grayscale" crossOrigin="anonymous" />
                ) : (
                  <span className="text-xl font-bold text-gray-300">{getProfileInitial(result.profile)}</span>
                )}
              </div>
            </div>
            {rarityLabel && (
               <div className="text-center font-mono text-[10px] font-bold border border-gray-200 py-1.5 bg-gray-50 tracking-widest text-gray-600 uppercase">
                 CLASS: {rarityLabel}
               </div>
            )}
          </div>

          {/* 右侧文字总结区 */}
          <div className="w-full md:w-2/3 flex flex-col justify-center">
            <div className="mb-4">
               <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">{result.modeKicker} / {result.badge}</span>
               <div className="flex items-baseline gap-4 mt-1">
                 <h2 className="text-6xl sm:text-7xl font-black tracking-tighter">{typeCode}</h2>
               </div>
               <h3 className="text-xl font-bold text-gray-600 mt-2">{result.finalType.cn}</h3>
            </div>
            
            {/* 唯一的一段核心总结 */}
            <div className="bg-gray-50 border-l-[3px] border-black p-5 mt-2">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Executive Summary</h4>
               <p className="text-[13px] sm:text-sm leading-relaxed text-gray-800 font-medium text-justify">
                 {firstParagraph}
               </p>
            </div>
          </div>
        </div>

        {/* 纯图表分析区 */}
        <div className="border border-black flex flex-col md:flex-row">
          {/* 左侧：雷达图 */}
          <div className="w-full md:w-1/2 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-black relative bg-gray-50/30">
            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-black mb-6 flex justify-between">
              <span>Dimension Analysis</span>
              <span className="text-gray-400">Fig. 1</span>
            </h4>
            <div className="w-full flex justify-center items-center">
              <RadarChart cx="50%" cy="50%" outerRadius={85} width={260} height={260} data={radarData}>
                <PolarGrid stroke="#d1d5db" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 11, fontWeight: 700 }} />
                <PolarRadiusAxis angle={90} domain={[0, 3]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={2}
                  fill="#000"
                  fillOpacity={0.1}
                />
              </RadarChart>
            </div>
            {/* 装饰性坐标轴说明 */}
            <div className="absolute bottom-4 right-4 text-[9px] font-mono text-gray-400 text-right">
              <p>Scale: 0-3</p>
              <p>Norm: Radial</p>
            </div>
          </div>

          {/* 右侧：血液检测单风格的条形图 */}
          <div className="w-full md:w-1/2 p-5 sm:p-6 bg-white">
            <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-black mb-6 flex justify-between">
              <span>Clinical Indicators</span>
              <span className="text-gray-400">Fig. 2</span>
            </h4>
            
            <div className="space-y-6">
              {Object.entries(modelGroups).map(([model, dims]) => (
                <div key={model}>
                  <div className="text-[10px] font-bold text-gray-400 border-b border-gray-100 pb-1 mb-2.5 uppercase tracking-wider">
                    {model.replace('模型', '')}
                  </div>
                  <div className="space-y-2.5">
                    {dims.map((dim) => (
                      <div key={dim.dim} className="flex items-center text-[10px] font-mono group">
                        <span className="w-20 text-gray-700 truncate pr-2 group-hover:text-black transition-colors">{shortName(dim.name)}</span>
                        {/* 进度条设计 */}
                        <div className="flex-1 flex h-1.5 bg-gray-100 relative">
                          <div className="absolute top-0 bottom-0 left-1/3 border-l border-white z-10" />
                          <div className="absolute top-0 bottom-0 left-2/3 border-l border-white z-10" />
                          <div className={`h-full opacity-90 ${LEVEL_DOT[dim.level].barClass}`} />
                        </div>
                        <span className="w-10 text-right font-bold ml-3" style={{ color: LEVEL_DOT[dim.level].val === 3 ? '#000' : '#888' }}>
                          {LEVEL_DOT[dim.level].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 签名/盖章区 */}
        <div className="mt-12 flex justify-between items-end">
          <div className="w-48 border-t border-black pt-2">
             <p className="text-[9px] font-mono text-gray-500 tracking-widest uppercase text-center">Authorized Signature</p>
          </div>
          
          <div className="w-24 h-24 rounded-full border-[3px] border-red-700/80 flex items-center justify-center transform -rotate-12 opacity-80 mix-blend-multiply">
             <span className="text-[11px] tracking-[0.2em] text-red-700/80 font-black text-center leading-tight">FINAL<br/>RESULT</span>
          </div>
        </div>
      </div>

      {/* 底部声明 */}
      <footer className="bg-black text-white px-6 sm:px-8 py-4 flex justify-between items-center text-[8px] sm:text-[9px] font-mono tracking-widest">
        <span>IMSB SYSTEM OP/2.0</span>
        <span className="hidden sm:inline">CONFIDENTIAL DOCUMENT</span>
        <span>END OF REPORT / P.1</span>
      </footer>
    </article>
  );
}


