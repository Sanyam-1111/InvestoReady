import { ProvenanceType } from '../types/finance';

export function formatCurrency(value: number, compact = false): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (compact) {
    if (abs >= 1_000_000) {
      return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
    }
    if (abs >= 1_000) {
      return `${sign}$${(abs / 1_000).toFixed(1)}k`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export const PROVENANCE_META: Record<
  ProvenanceType,
  {
    label: string;
    shortLabel: string;
    description: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  bank_derived: {
    label: 'Bank Derived',
    shortLabel: 'bank_derived',
    description: 'Calculated directly from synced bank account feeds (Mercury Checking & Treasury).',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  accounting_derived: {
    label: 'Accounting Derived',
    shortLabel: 'accounting_derived',
    description: 'Derived from general ledger journal entries and billing sub-ledgers (QuickBooks + Stripe).',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-700',
    borderClass: 'border-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  founder_entered: {
    label: 'Founder Entered',
    shortLabel: 'founder_entered',
    description: 'Manually entered or adjusted by the founder/finance team; not directly matched to a feed.',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-300',
    dotClass: 'bg-slate-500',
  },
  ai_extracted: {
    label: 'AI Extracted · Needs Review',
    shortLabel: 'ai_extracted',
    description: 'Parsed from uploaded PDFs/invoices via AI extraction. Remains marked for review until human-confirmed.',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    dotClass: 'bg-amber-500',
  },
  projected: {
    label: 'Projected',
    shortLabel: 'projected',
    description: 'Forward-looking model output based on historical run-rate and scenario assumptions.',
    bgClass: 'bg-violet-50',
    textClass: 'text-violet-700',
    borderClass: 'border-violet-200',
    dotClass: 'bg-violet-500',
  },
  unreconciled: {
    label: 'Unreconciled',
    shortLabel: 'unreconciled',
    description: 'Contains unmatched bank or ledger transactions pending reconciliation.',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
    dotClass: 'bg-rose-500',
  },
};

export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
