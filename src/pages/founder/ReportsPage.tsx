import React, { useState } from 'react';
import { Download, FileBarChart2, Plus, Printer } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { usePlatform } from '../../context/PlatformContext';
import { FinancialReportItem } from '../../types/finance';
import { downloadTextFile } from '../../utils/formatters';

export const ReportsPage: React.FC = () => {
  const { reports, addReport, confidenceScore, reconciliationCoveragePct } = usePlatform();
  const [selectedId, setSelectedId] = useState<string>(reports[0]?.id || '');

  const selected = reports.find((r) => r.id === selectedId) || reports[0];

  const handleGenerateSnapshot = () => {
    const title = `Board & Transparency Snapshot (${new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })})`;
    addReport({
      title,
      type: 'Board Update',
      period: 'Nov 2026 MTD',
      audience: 'Investor Shared',
      confidenceScore,
      summary: `Generated live snapshot with ${reconciliationCoveragePct}% reconciliation coverage, $1,842,400 cash balance, and $88,400 net burn.`,
      highlights: [
        'All bank-derived cash figures synced from Mercury Checking & Treasury',
        `Financial Confidence Score: ${confidenceScore}/100 (source-linked, not an independent audit)`,
      ],
    });
  };

  const handleDownload = (report: FinancialReportItem) => {
    const body = [
      `INVESTOR-READY FINANCIAL REPORT`,
      `Title: ${report.title}`,
      `Type: ${report.type}`,
      `Period: ${report.period}`,
      `Audience: ${report.audience}`,
      `Financial Confidence Score: ${report.confidenceScore}/100`,
      `Generated: ${report.generatedAt}`,
      ``,
      `EXECUTIVE SUMMARY`,
      report.summary,
      ``,
      `KEY HIGHLIGHTS`,
      ...report.highlights.map((h, i) => `${i + 1}. ${h}`),
      ``,
      `NOTICE: Metrics are source-linked to connected bank, accounting, and uploaded feeds. This summary is not an independent GAAP audit.`,
    ].join('\n');
    downloadTextFile(`${report.id.toLowerCase()}-summary.txt`, body);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Reports"
        subtitle="Generate provenance-annotated financial summaries and exportable executive packs."
        actions={
          <button
            onClick={handleGenerateSnapshot}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Generate Snapshot Report</span>
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Library */}
        <div className="space-y-2.5">
          {reports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedId(rep.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all ${
                selected?.id === rep.id
                  ? 'border-brand-500 bg-brand-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                  {rep.type}
                </span>
                <span className="font-mono text-[11px] text-slate-400">{rep.period}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{rep.title}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>{rep.audience}</span>
                <span className="font-mono text-emerald-700">Score {rep.confidenceScore}/100</span>
              </div>
            </button>
          ))}
        </div>

        {/* Report Preview Pane */}
        {selected && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileBarChart2 className="h-4 w-4 text-brand-600" />
                  <span>{selected.id}</span>
                  <span>·</span>
                  <span>{selected.generatedAt}</span>
                </div>
                <h2 className="mt-1 text-lg font-semibold text-slate-900">{selected.title}</h2>
              </div>
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => handleDownload(selected)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Summary</span>
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-5 text-xs">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-semibold uppercase tracking-wider text-slate-500">
                  Executive Summary
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{selected.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-slate-500">Cash Balance</p>
                  <p className="mt-1 font-mono text-base font-semibold text-slate-900">$1,842,400</p>
                  <div className="mt-1.5">
                    <ProvenanceBadge type="bank_derived" compact />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-slate-500">Monthly Revenue</p>
                  <p className="mt-1 font-mono text-base font-semibold text-slate-900">$148,500</p>
                  <div className="mt-1.5">
                    <ProvenanceBadge type="accounting_derived" compact />
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-slate-500">Confidence Score</p>
                  <p className="mt-1 font-mono text-base font-semibold text-emerald-700">
                    {selected.confidenceScore} / 100
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">Source-linked transparency</p>
                </div>
              </div>

              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-500">
                  Key Verified Highlights
                </p>
                <ul className="mt-2 space-y-2">
                  {selected.highlights.map((h, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2 text-slate-700"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
