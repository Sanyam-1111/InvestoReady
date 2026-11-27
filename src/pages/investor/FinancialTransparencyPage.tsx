import React from 'react';
import { AlertTriangle, CheckCircle2, Info, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { RestrictedAccessCard } from '../../components/shared/RestrictedAccessCard';
import { CONFIDENCE_BREAKDOWN } from '../../data/mockFinancialData';
import { CORE_METRICS, usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const FinancialTransparencyPage: React.FC = () => {
  const {
    confidenceScore,
    reconciliationCoveragePct,
    reconciliationItems,
    permissions,
    openTraceMetric,
  } = usePlatform();

  const unmatchedOrFlagged = reconciliationItems.filter((r) => r.status !== 'matched');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Transparency & Provenance"
        subtitle="Inspect how reported company numbers connect to bank feeds, accounting ledgers, and AI reviews."
        badge={`Score ${confidenceScore}/100`}
      />

      {/* Explicit Scope Notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs text-indigo-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
        <div>
          <p className="font-semibold">Source-Linked Transparency Notice</p>
          <p className="mt-0.5 text-indigo-800">
            Investor-Ready links metrics directly to synced bank feeds, general ledgers, and uploaded
            documents. AI-extracted values remain flagged until human confirmation. Source-linked
            data is not an independent CPA audit.
          </p>
        </div>
      </div>

      {/* Confidence Score + Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Financial Confidence Score</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tracking-tight text-slate-900 tabular-nums">
                {confidenceScore}
              </span>
              <span className="text-sm font-medium text-slate-400">/ 100</span>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              {reconciliationCoveragePct}% of bank transactions are reconciled against QuickBooks
              entries for November 2026.
            </p>
          </div>
          <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs">
            <p className="font-semibold text-slate-700">Inspect Live Provenance Traces:</p>
            <div className="flex flex-wrap gap-1.5">
              {['cash_balance', 'mrr', 'net_burn', 'ap_balance'].map((id) => (
                <button
                  key={id}
                  disabled={!permissions.allowProvenanceDrilldown}
                  onClick={() => openTraceMetric(id)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-medium text-slate-700 hover:border-brand-300 hover:bg-brand-50 disabled:opacity-50"
                >
                  {CORE_METRICS[id].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="text-sm font-semibold text-slate-900">Score Factor Breakdown</h2>
          <div className="mt-4 space-y-4">
            {CONFIDENCE_BREAKDOWN.map((item) => {
              const pct = Math.round((item.score / item.maxScore) * 100);
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{item.label}</span>
                      <ProvenanceBadge type={item.provenance} compact />
                    </div>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {item.score} / {item.maxScore}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        pct >= 85 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Unmatched Transactions & Discrepancies */}
      {permissions.shareReconciliationDiscrepancies ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Unmatched Transactions &amp; Discrepancies
              </h3>
              <p className="text-xs text-slate-500">
                Live transparency into open items currently excluded from full reconciliation
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {unmatchedOrFlagged.length} Open Items
            </span>
          </div>

          {unmatchedOrFlagged.length === 0 ? (
            <div className="flex items-center gap-2 py-8 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>All November reconciliation items are currently matched!</span>
            </div>
          ) : (
            <div className="mt-3 divide-y divide-slate-100">
              {unmatchedOrFlagged.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.bankDescription !== 'No Bank Settlement Yet'
                          ? item.bankDescription
                          : item.ledgerDescription}
                      </p>
                      <p className="mt-0.5 text-slate-500">{item.reason}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      Variance {formatCurrency(item.variance)}
                    </span>
                    <p className="text-[10px] font-medium uppercase text-amber-700">
                      {item.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <RestrictedAccessCard
          sectionName="Reconciliation Discrepancies"
          permissionLabel="Share Reconciliation & Unmatched Items"
        />
      )}
    </div>
  );
};
