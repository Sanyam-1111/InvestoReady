import React, { useState } from 'react';
import { Download, FileCheck2 } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';
import { downloadTextFile } from '../../utils/formatters';

export const InvestorReportsPage: React.FC = () => {
  const { reports } = usePlatform();
  const sharedReports = reports.filter((r) => r.audience === 'Investor Shared');
  const [activeId, setActiveId] = useState(sharedReports[0]?.id || '');

  const current = sharedReports.find((r) => r.id === activeId) || sharedReports[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investor Reports"
        subtitle="Downloadable board updates and source-linked financial packs shared by the founder."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2.5">
          {sharedReports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setActiveId(rep.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                current?.id === rep.id
                  ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                  {rep.type}
                </span>
                <span className="font-mono text-slate-400">{rep.period}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{rep.title}</p>
              <p className="mt-1 font-mono text-[11px] text-emerald-700">
                Confidence {rep.confidenceScore}/100
              </p>
            </button>
          ))}
        </div>

        {current && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                  <span>{current.id}</span>
                  <span>·</span>
                  <span>{current.generatedAt}</span>
                </div>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{current.title}</h2>
              </div>
              <button
                onClick={() =>
                  downloadTextFile(
                    `${current.id.toLowerCase()}-investor.txt`,
                    `${current.title}\nConfidence: ${current.confidenceScore}/100\n\n${current.summary}\n\n${current.highlights.join('\n')}`
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Report</span>
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">{current.summary}</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              {current.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
