import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Flag,
  UploadCloud,
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';
import { ReconciliationItem } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

export const ReconciliationPage: React.FC = () => {
  const {
    reconciliationItems,
    updateReconciliationStatus,
    reconciliationCoveragePct,
    notify,
  } = usePlatform();
  const [statusTab, setStatusTab] = useState<'all' | ReconciliationItem['status']>('all');
  const [bankUploadState, setBankUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [ledgerUploadState, setLedgerUploadState] = useState<'idle' | 'uploading' | 'done'>('idle');

  const simulateUpload = (kind: 'bank' | 'ledger', fileName?: string) => {
    const setter = kind === 'bank' ? setBankUploadState : setLedgerUploadState;
    setter('uploading');
    window.setTimeout(() => {
      setter('done');
      notify(
        `${kind === 'bank' ? 'Bank statement' : 'Accounting ledger'} staged`,
        `${fileName || (kind === 'bank' ? 'mercury_nov_2026.csv' : 'qbo_trial_balance_nov.csv')} queued for Stage 2 parser.`
      );
    }, 650);
  };

  const filtered = reconciliationItems.filter(
    (item) => statusTab === 'all' || item.status === statusTab
  );

  const counts = {
    all: reconciliationItems.length,
    matched: reconciliationItems.filter((i) => i.status === 'matched').length,
    needs_review: reconciliationItems.filter((i) => i.status === 'needs_review').length,
    unmatched: reconciliationItems.filter((i) => i.status === 'unmatched').length,
    discrepancy: reconciliationItems.filter((i) => i.status === 'discrepancy').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bank & Accounting Reconciliation"
        subtitle="Match bank feed deposits and withdrawals against QuickBooks general ledger entries."
        badge={`${reconciliationCoveragePct}% Coverage`}
      />

      {/* Upload Areas */}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/20">
          <input
            type="file"
            accept=".csv,.pdf"
            className="hidden"
            onChange={(e) => simulateUpload('bank', e.target.files?.[0]?.name)}
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Upload Bank Statements (CSV / PDF)
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Mercury, SVB, Chase, or Ramp card statement exports
          </p>
          <span className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 group-hover:bg-white">
            {bankUploadState === 'uploading'
              ? 'Staging statement...'
              : bankUploadState === 'done'
              ? 'Statement staged · Click to replace'
              : 'Select Bank File'}
          </span>
        </label>

        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center transition-colors hover:border-brand-400 hover:bg-brand-50/20">
          <input
            type="file"
            accept=".csv,.json,.xlsx"
            className="hidden"
            onChange={(e) => simulateUpload('ledger', e.target.files?.[0]?.name)}
          />
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Upload Accounting Ledger (CSV / QBO Export)
          </p>
          <p className="mt-1 text-xs text-slate-500">
            QuickBooks, Xero, or NetSuite general ledger transactions
          </p>
          <span className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 group-hover:bg-white">
            {ledgerUploadState === 'uploading'
              ? 'Staging ledger...'
              : ledgerUploadState === 'done'
              ? 'Ledger staged · Click to replace'
              : 'Select Ledger File'}
          </span>
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'all', label: 'All Items' },
            { key: 'matched', label: 'Matched' },
            { key: 'needs_review', label: 'Needs Review' },
            { key: 'unmatched', label: 'Unmatched' },
            { key: 'discrepancy', label: 'Discrepancies' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusTab(tab.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              statusTab === tab.key
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Matching Workbench */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all hover:border-slate-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-medium text-slate-500">{item.id}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="font-mono text-xs text-slate-600">{item.date}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                    item.status === 'matched'
                      ? 'bg-emerald-50 text-emerald-700'
                      : item.status === 'discrepancy'
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {item.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-500">
                  Match score:{' '}
                  <strong className="font-mono text-slate-900">{item.matchScore}%</strong>
                </span>
                {item.variance !== 0 && (
                  <span className="rounded bg-rose-50 px-2 py-0.5 font-mono font-medium text-rose-700">
                    Variance {formatCurrency(item.variance)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Bank Feed · {item.bankAccount}
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900">{item.bankDescription}</p>
                  <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(item.bankAmount)}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Accounting Ledger · {item.ledgerRef || 'No Match'}
                </p>
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <p className="text-xs font-medium text-slate-900">
                    {item.ledgerDescription || 'Unmatched bank transaction'}
                  </p>
                  <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                    {item.ledgerAmount !== undefined ? formatCurrency(item.ledgerAmount) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {(item.reason || item.status !== 'matched') && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-1">
                <p className="flex items-center gap-1.5 text-xs text-slate-600">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  <span>{item.reason || 'Awaiting match confirmation'}</span>
                </p>
                <div className="flex items-center gap-2">
                  {item.status !== 'matched' && (
                    <button
                      onClick={() => updateReconciliationStatus(item.id, 'matched')}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve Match</span>
                    </button>
                  )}
                  {item.status !== 'discrepancy' && (
                    <button
                      onClick={() => updateReconciliationStatus(item.id, 'discrepancy')}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <Flag className="h-3.5 w-3.5 text-rose-500" />
                      <span>Flag Discrepancy</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
