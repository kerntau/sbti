'use client';

import Image from 'next/image';
import { TestResult } from '@/types';
import { getProfileDisplayName, getProfileInitial } from '@/lib/profile';
import DimensionBar from './DimensionBar';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { FileText, Fingerprint, Activity, Clock } from 'lucide-react';

interface ResultCardProps {
  result: TestResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const strongestAxis = [...result.axisBreakdown].sort((a, b) => b.margin - a.margin)[0];
  const displayName = getProfileDisplayName(result.profile);
  const hasProfile = Boolean(result.profile?.nickname || result.profile?.qq || result.profile?.avatarUrl);

  const radarData = result.axisBreakdown.map((axis) => {
    return {
      subject: axis.label,
      value: Math.max(axis.percentA, axis.percentB),
      fullMark: 100,
    };
  });

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 relative z-10">
      <section className="clinical-card bg-white overflow-hidden p-8 md:p-10 relative flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-4 border-l-slate-900">
        
        <div className="flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
            <FileText className="w-3 h-3" /> CLINICAL PROFILE REPORT
          </p>

          {hasProfile && (
            <div className="flex items-center gap-4 mb-6">
              <div className="relative h-12 w-12 overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                {result.profile?.avatarUrl ? (
                  <Image src={result.profile.avatarUrl} alt={`${displayName}`} fill sizes="48px" className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-800">
                    {getProfileInitial(result.profile)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-900 uppercase">SUBJECT: {displayName}</p>
                <p className="text-[10px] font-mono tracking-widest text-slate-400 mt-1">ID: {result.profile?.qq || 'GUEST-001'}</p>
              </div>
            </div>
          )}

          <div className="relative z-10 flex flex-wrap items-baseline gap-4 mt-2">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900">
              {result.type}
            </h1>
            <p className="text-xl md:text-2xl font-medium tracking-widest text-slate-400">{result.personality.name}</p>
          </div>
          
          <p className="mt-4 max-w-2xl text-sm leading-relaxed tracking-wide text-slate-600">
            {result.personality.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 z-10">
            <span className="border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold tracking-widest text-slate-900 uppercase rounded flex items-center gap-2">
              <Activity className="w-3 h-3" />
              CONFIDENCE {confidencePct}%
            </span>
            <span className="border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase rounded flex items-center gap-2">
              <Clock className="w-3 h-3" />
              T_ELAPSED {(result.durationMs / 1000).toFixed(1)}s
            </span>
            <span className="border border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase rounded flex items-center gap-2">
              <Fingerprint className="w-3 h-3 text-slate-900" />
              DOMINANT {strongestAxis.dominantLabel}
            </span>
          </div>
        </div>

        <div className="w-full md:w-64 h-64 flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Type" dataKey="value" stroke="#0f172a" strokeWidth={2} fill="#0f172a" fillOpacity={0.1} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="clinical-card bg-white p-6 md:p-8">
          <h2 className="text-sm font-bold text-slate-900 tracking-widest uppercase mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
             DATA BREAKDOWN (四维参数分型)
          </h2>

          <div className="space-y-6">
            {result.axisBreakdown.map((axis) => (
              <DimensionBar
                key={axis.axis}
                label={axis.label}
                labelA={axis.labelA}
                labelB={axis.labelB}
                slangA={axis.slangA}
                slangB={axis.slangB}
                percentA={axis.percentA}
                percentB={axis.percentB}
                description={axis.description}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6 flex flex-col">
          <section className="clinical-card bg-white p-6 md:p-8 flex-1">
            <h3 className="text-[10px] font-bold text-emerald-600 tracking-widest uppercase mb-4 border-b border-slate-50 pb-2">
              [+] ASSESSED STRENGTHS (效能优势)
            </h3>
            <div className="space-y-3">
              {result.personality.strengths.map((item) => (
                <div key={item} className="border-l-2 border-emerald-500 bg-emerald-50/50 pl-3 py-2 text-xs leading-relaxed text-slate-700">
                  {item}
                </div>
              ))}
            </div>
            
            <h3 className="text-[10px] font-bold text-rose-600 tracking-widest uppercase mt-8 mb-4 border-b border-slate-50 pb-2">
              [-] IDENTIFIED RISKS (效能偏差风险)
            </h3>
            <div className="space-y-3">
              {result.personality.weaknesses.map((item) => (
                <div key={item} className="border-l-2 border-rose-500 bg-rose-50/50 pl-3 py-2 text-xs leading-relaxed text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="clinical-card bg-slate-900 p-6 md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
              COMMUNICATION PROTOCOL <FileText className="w-3 h-3" />
            </p>
            <p className="text-xs leading-relaxed text-slate-300 font-mono">{result.personality.communication}</p>
          </section>
        </div>
      </section>
    </div>
  );
}
