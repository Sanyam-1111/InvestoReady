import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const ExpenseOptimizerPage: React.FC = () => {
  const { findings, sendFindingToRecommendations, dismissFinding } = usePlatform();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'actionable_waste' | 'needs_review' | 'legitimate_monitored'>('all');

  const actionableFindings = findings.filter(
    (f) => f.classification !== 'legitimate_monitored' && f.status !== 'dismissed'
  );
  const monthlySavings = actionableFindings.reduce((acc, f) => acc + f.estimatedMonthlySavings, 0);
  const annualSavings = monthlySavings * 12;

  const displayed = findings.filter((f) => filter === 'all' || f.classification === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Expense Optimizer"
        subtitle="Evidence-backed spend analysis separating genuine waste from legitimate core infrastructure."
        badge="Demo Intelligence"
        actions={
          <button
            onClick={() => navigate('/founder/scenarios')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-brand-700"
          >
            <span>Simulate Runway Impact</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      />

      {/* Savings Summary Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
          <p className="text-xs font-medium text-emerald-800">Estimated Monthly Savings</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-900 tabular-nums">
            {formatCurrency(monthlySavings)}/mo
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            Reduces net burn from $88.4k to {formatCurrency(88400 - monthlySavings)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-medium text-slate-500">Annualized Cash Preserved</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(annualSavings)}
          </p>
          <p className="mt-1 text-xs text-slate-500">Extends cash runway by +3.0 months</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-xs font-medium text-slate-500">Legitimate Core Protected</p>
          <p className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            {formatCurrency(153200)}/mo
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Payroll &amp; core Snowflake compute explicitly excluded from cuts
          </p>
        </div>
      </div>

      {/* Classification Filter */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'all', label: 'All Evaluated Spend' },
            { key: 'actionable_waste', label: 'Actionable Waste' },
            { key: 'needs_review', label: 'Optimization Review' },
            { key: 'legitimate_monitored', label: 'Legitimate Core (No Cut)' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === tab.key
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {displayed.map((finding) => {
          const isLegit = finding.classification === 'legitimate_monitored';
          return (
            <div
              key={finding.id}
              className={`rounded-2xl border bg-white p-5 shadow-card ${
                isLegit ? 'border-slate-200' : 'border-slate-200 hover:border-brand-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                        isLegit
                          ? 'bg-emerald-50 text-emerald-700'
                          : finding.classification === 'actionable_waste'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {isLegit ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {isLegit ? 'Legitimate Core Spend' : finding.category}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-medium text-slate-600">{finding.vendor}</span>
                    <ProvenanceBadge type="ai_extracted" compact />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{finding.title}</h3>
                </div>

                <div className="text-right">
                  {isLegit ? (
                    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      $0 Cut Recommended
                    </span>
                  ) : (
                    <>
                      <p className="text-[11px] text-slate-500">Potential Savings</p>
                      <p className="font-mono text-lg font-bold text-emerald-600 tabular-nums">
                        {formatCurrency(finding.estimatedMonthlySavings)}/mo
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div className="rounded-xl bg-slate-50/80 p-3.5 text-xs lg:col-span-2">
                  <p className="font-semibold text-slate-900">Why This Was Flagged &amp; Context</p>
                  <p className="mt-1 leading-relaxed text-slate-600">{finding.whyFlagged}</p>
                  <ul className="mt-2.5 space-y-1 text-slate-600">
                    {finding.evidence.map((ev, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 p-3.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">Operational Risk</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          finding.riskLevel === 'low'
                            ? 'bg-emerald-50 text-emerald-700'
                            : finding.riskLevel === 'medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {finding.riskLevel} risk
                      </span>
                    </div>
                    <p className="mt-1.5 text-slate-600">{finding.riskExplanation}</p>
                    <p className="mt-2.5 font-medium text-slate-900">
                      Suggested Action: <span className="font-normal text-slate-600">{finding.suggestedAction}</span>
                    </p>
                  </div>

                  {!isLegit && (
                    <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
                      {finding.status === 'sent_to_recs' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Queued in Recommendations
                        </span>
                      ) : finding.status === 'dismissed' ? (
                        <span className="inline-flex items-center gap-1 text-slate-400">
                          <XCircle className="h-3.5 w-3.5" />
                          Dismissed
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => sendFindingToRecommendations(finding.id)}
                            className="flex-1 rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
                          >
                            Queue Action
                          </button>
                          <button
                            onClick={() => dismissFinding(finding.id)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Dismiss
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  {isLegit && (
                    <div className="mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
                      <AlertTriangle className="h-3.5 w-3.5 text-slate-400" />
                      <span>Protected from automated cuts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
