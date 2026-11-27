import React from 'react';
import {
  CheckCircle2,
  Clock,
  Info,
  Layers,
  ShieldAlert,
  X,
} from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { ProvenanceBadge } from './ProvenanceBadge';

export const ProvenanceDrawer: React.FC = () => {
  const { activeTraceMetric, closeTraceMetric, roleMode } = usePlatform();

  if (!activeTraceMetric) return null;

  const statusConfig = {
    reconciled: {
      label: 'Reconciled',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    partial: {
      label: 'Partially Reconciled',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    unreconciled: {
      label: 'Unreconciled Items Present',
      className: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    ai_review: {
      label: 'AI Review Pending',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    projected: {
      label: 'Model Projection',
      className: 'bg-violet-50 text-violet-700 border-violet-200',
    },
  }[activeTraceMetric.reconciliationStatus];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25 backdrop-blur-[1px]">
      <div className="fixed inset-0" onClick={closeTraceMetric} />
      <aside className="animate-drawer-in relative z-10 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-500">
              <Layers className="h-3.5 w-3.5 text-brand-600" />
              <span>Financial Provenance Trace</span>
              {roleMode === 'investor' && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                  Investor Read-Only
                </span>
              )}
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">{activeTraceMetric.label}</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {activeTraceMetric.formattedValue}
              </span>
              <ProvenanceBadge type={activeTraceMetric.provenance} />
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusConfig.className}`}
              >
                {statusConfig.label}
              </span>
            </div>
          </div>
          <button
            onClick={closeTraceMetric}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close provenance drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          {/* Source & Formula */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Primary Source
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {activeTraceMetric.sourceLabel}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  Last Synced &amp; Review
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{activeTraceMetric.lastSynced}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 border-t border-slate-200/80 pt-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                Calculation Formula
              </p>
              <code className="mt-1 block rounded-md bg-white px-2.5 py-1.5 font-mono text-xs text-slate-800 ring-1 ring-slate-200">
                {activeTraceMetric.formula}
              </code>
            </div>
          </div>

          {/* Human confirmation banner if AI extracted */}
          {!activeTraceMetric.humanConfirmed && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-semibold">Pending Human Confirmation</p>
                <p className="mt-0.5 text-amber-800">
                  One or more inputs include AI-extracted figures from uploaded PDFs. They remain
                  marked for review until confirmed by the founder or finance controller.
                </p>
              </div>
            </div>
          )}

          {/* Calculation Breakdown */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Calculation Breakdown
            </h3>
            <div className="mt-2.5 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {activeTraceMetric.steps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{step.label}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs text-slate-500">{step.source}</span>
                      <ProvenanceBadge type={step.provenance} compact />
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    {step.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contributing Records */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contributing Source Records
            </h3>
            <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-3.5 py-2.5">Record</th>
                    <th className="px-3.5 py-2.5">Source</th>
                    <th className="px-3.5 py-2.5 text-right">Amount</th>
                    <th className="px-3.5 py-2.5 text-right">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {activeTraceMetric.contributingRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70">
                      <td className="px-3.5 py-2.5">
                        <p className="font-medium text-slate-800">{rec.description}</p>
                        <p className="font-mono text-[11px] text-slate-400">
                          {rec.id} · {rec.date}
                        </p>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-600">{rec.source}</td>
                      <td className="px-3.5 py-2.5 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {rec.amount}
                      </td>
                      <td className="px-3.5 py-2.5 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            rec.status === 'Matched' || rec.status === 'Verified Feed' || rec.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          <CheckCircle2 className="h-2.5 w-2.5" />
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <p>
              Provenance traces link reported figures to connected bank, ledger, and uploaded
              records. Source-linked transparency is not an independent GAAP audit or CPA
              attestation.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};
