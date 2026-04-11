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
      className="relative bg-white text-black mx-auto w-full max-w-[800px] overflow-hidden shadow-md selection:bg-gray-200"
    >
      {/* 极简纸张质感 */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      {/* 顶部主标题栏 */}
      <header className="px-6 sm:px-8 pt-8 pb-4 flex justify-between items-end border-b-[3px] border-black">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-none">IMSB EVALUATION</h1>
          <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-gray-500 mt-2 uppercase">Official Clinical Report</p>
        </div>
        <div className="hidden sm:block pb-1">
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
        <div className="px-6 sm:px-8 py-2.5 flex flex-col justify-center bg-gray-50">
          <span className="text-gray-400">RARITY</span>
          <span className="font-bold text-xs">{rarity}%</span>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Row 1: 文字总结 (左) + 角色图纸 (右) */}
        <div className="flex flex-col-reverse md:flex-row gap-6 mb-8 items-stretch">
          
          {/* 左侧文字总结区 */}
          <div className="w-full md:w-2/3 flex flex-col justify-between">
            <div className="mb-4">
               <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">{result.modeKicker} / {result.badge}</span>
               <div className="flex items-baseline gap-4 mt-1">
                 <h2 className="text-6xl sm:text-7xl font-black tracking-tighter">{typeCode}</h2>
               </div>
               <h3 className="text-xl font-bold text-gray-600 mt-2">{result.finalType.cn}</h3>
            </div>
            
            <div className="bg-gray-50/80 border border-gray-200 p-4 sm:p-5 flex-1 flex flex-col justify-center relative">
               <div className="absolute top-0 left-0 w-1 h-full bg-black" />
               <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Executive Summary</h4>
               <p className="text-[13px] leading-[1.8] text-gray-800 font-medium text-justify">
                 {firstParagraph}
               </p>
            </div>
          </div>

          {/* 右侧卡证区域 */}
          <div className="w-full md:w-1/3 flex flex-col sm:h-[unset] h-[240px]">
            <div className="relative border border-black p-2 flex-1 flex items-center justify-center bg-white min-h-[160px]">
              {/* 四周定位标 */}
              <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-gray-400" />
              <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-gray-400" />
              <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-gray-400" />
              <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-gray-400" />
              
              {imgSrc ? (
                <Image src={imgSrc} alt={typeCode} fill sizes="(max-width: 768px) 100vw, 240px" className="object-contain mix-blend-multiply opacity-95 p-4" priority crossOrigin="anonymous" />
              ) : (
                <div className="text-gray-300 text-xs font-mono">NO VERIFIED IMAGE</div>
              )}
              
              {/* 叠加小头像悬浮 */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-white border border-gray-300 shadow-sm flex items-center justify-center overflow-hidden z-10 hidden sm:flex">
                {hasAvatar ? (
                  <Image src={result.profile!.avatarUrl!} alt={displayName} fill sizes="48px" className="object-cover grayscale" crossOrigin="anonymous" />
                ) : (
                  <span className="text-lg font-bold text-gray-400">{getProfileInitial(result.profile)}</span>
                )}
              </div>
            </div>
            {rarityLabel && (
               <div className="text-center font-mono text-[10px] font-bold border-x border-b border-black py-1.5 bg-black text-white tracking-[0.2em] uppercase">
                 CLASS: {rarityLabel}
               </div>
            )}
          </div>
        </div>

        {/* Row 2: 图表分析区 (通过列布局完美平衡雷达图与超长条形图的高度差) */}
        <div className="border-t-[3px] border-black pt-8 mb-4">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-black mb-6 flex items-center gap-4">
            <span className="bg-black text-white px-2 py-0.5">DATA MATRIX</span>
            <span className="flex-1 border-b border-gray-300"></span>
          </h4>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* 左侧：雷达图 */}
            <div className="w-full md:w-[35%] flex flex-col">
              <div className="w-full border border-gray-200 bg-gray-50/50 p-4 relative flex-1 flex flex-col justify-center items-center">
                <span className="absolute top-3 left-3 text-[9px] font-mono text-gray-400">FIG. 1 / RADAR</span>
                <div className="w-full aspect-square flex justify-center items-center max-w-[220px]">
                  <RadarChart cx="50%" cy="50%" outerRadius={75} width={220} height={220} data={radarData}>
                    <PolarGrid stroke="#d1d5db" strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 3]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="value" stroke="#000" strokeWidth={2} fill="#000" fillOpacity={0.1} />
                  </RadarChart>
                </div>
                <div className="absolute bottom-3 right-3 text-[8px] font-mono text-gray-400 text-right">
                  <p>Scale: 0-3 / Norm: Radial</p>
                </div>
              </div>
            </div>

            {/* 右侧：高度收纳的 2列 条形图 */}
            <div className="w-full md:w-[65%] border border-gray-200 p-5 bg-white relative">
              <span className="block text-[9px] font-mono text-gray-400 mb-4 border-b border-gray-100 pb-2">FIG. 2 / CLINICAL INDICATORS</span>
              <div className="columns-1 sm:columns-2 gap-x-8 gap-y-6">
                {Object.entries(modelGroups).map(([model, dims]) => (
                  <div key={model} className="mb-6 break-inside-avoid">
                    <div className="text-[9px] font-bold text-black border-l-2 border-black pl-2 py-0.5 mb-2.5 uppercase tracking-widest bg-gray-50">
                      {model.replace('模型', '')}
                    </div>
                    <div className="space-y-2">
                      {dims.map((dim) => (
                        <div key={dim.dim} className="flex items-center text-[10px] font-mono group">
                          <span className="w-14 sm:w-16 text-gray-600 truncate pr-1 group-hover:text-black transition-colors">{shortName(dim.name)}</span>
                          {/* 进度条设计 */}
                          <div className="flex-1 flex h-1 bg-gray-100 relative">
                            <div className="absolute top-0 bottom-0 left-[33.3%] border-l border-white z-10" />
                            <div className="absolute top-0 bottom-0 left-[66.6%] border-l border-white z-10" />
                            <div className={`h-full opacity-90 ${LEVEL_DOT[dim.level].barClass}`} />
                          </div>
                          <span className="w-8 text-right font-bold ml-1.5 text-[9px]" style={{ color: LEVEL_DOT[dim.level].val === 3 ? '#000' : '#888' }}>
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
        </div>
        
        {/* 签名/盖章区 */}
        <div className="mt-8 pt-4 border-t border-black flex justify-between items-end relative h-16">
          <div className="self-end">
            <div className="w-32 sm:w-48 border-b-2 border-gray-200 mb-1 pointer-events-none"></div>
             <p className="text-[8px] sm:text-[9px] font-mono text-gray-400 tracking-widest uppercase">Authorized Signature</p>
          </div>
          
          <div className="absolute right-4 bottom-2 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-[3px] border-red-700/80 flex items-center justify-center transform -rotate-12 opacity-80 mix-blend-multiply pointer-events-none">
             <span className="text-[10px] sm:text-[11px] tracking-[0.2em] text-red-700/80 font-black text-center leading-tight">FINAL<br/>RESULT</span>
          </div>
        </div>
      </div>

      {/* 底部声明 */}
      <footer className="bg-black text-white px-6 sm:px-8 py-3 flex justify-between items-center text-[8px] sm:text-[9px] font-mono tracking-widest">
        <span>IMSB SYSTEM OP/2.0</span>
        <span className="hidden sm:inline">CONFIDENTIAL DOCUMENT</span>
        <span>END OF REPORT / P.1</span>
      </footer>
    </article>
  );
}


