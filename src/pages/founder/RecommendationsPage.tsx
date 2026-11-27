import React, { useState } from 'react';
import { CheckCircle2, Clock, ListChecks, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';
import { Recommendation } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, updateRecommendationStatus } = usePlatform();
  const [statusFilter, setStatusFilter] = useState<'all' | Recommendation['status']>('all');

  const realizedMonthly = recommendations
    .filter((r) => r.status === 'implemented')
    .reduce((acc, r) => acc + r.monthlySavings, 0);
  const approvedMonthly = recommendations
    .filter((r) => r.status === 'approved')
    .reduce((acc, r) => acc + r.monthlySavings, 0);
  const totalPipeline = recommendations.reduce((acc, r) => acc + r.monthlySavings, 0);

  const visible = recommendations.filter(
    (r) => statusFilter === 'all' || r.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommendations Action Queue"
        subtitle="Track approved cost-saving initiatives from problem diagnosis through implementation."
      />

      {/* Cumulative Savings Tracker */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Total Identified Pipeline</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(totalPipeline)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Approved (In Execution)</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-brand-600 tabular-nums">
            {formatCurrency(approvedMonthly)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <p className="text-xs font-medium text-emerald-800">Implemented Savings</p>
          <p className="mt-1 font-mono text-2xl font-bold text-emerald-900 tabular-nums">
            {formatCurrency(realizedMonthly)}/mo
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'implemented'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              statusFilter === st
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-4">
        {visible.map((rec) => (
          <div key={rec.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                      rec.priority === 'quick_win'
                        ? 'bg-emerald-50 text-emerald-700'
                        : rec.priority === 'high'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rec.priority.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-500">{rec.category}</span>
                </div>
                <h3 className="mt-1.5 text-base font-semibold text-slate-900">{rec.title}</h3>
              </div>

              <div className="text-right">
                <p className="font-mono text-lg font-bold text-emerald-600 tabular-nums">
                  +{formatCurrency(rec.monthlySavings)}/mo
                </p>
                <p className="text-[11px] text-slate-400">
                  {formatCurrency(rec.annualSavings)} annualized
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-xl bg-slate-50 p-3.5 text-xs">
                <p>
                  <strong className="text-slate-900">Problem:</strong>{' '}
                  <span className="text-slate-600">{rec.problem}</span>
                </p>
                <p>
                  <strong className="text-slate-900">Evidence:</strong>{' '}
                  <span className="text-slate-600">{rec.evidence}</span>
                </p>
                <p className="flex items-start gap-1.5 text-slate-600">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span>
                    <strong className="text-slate-900">Risk ({rec.riskLevel}):</strong> {rec.riskNote}
                  </span>
                </p>
              </div>

              <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 p-3.5 text-xs">
                <div>
                  <p className="flex items-center gap-1.5 font-semibold text-slate-900">
                    <ListChecks className="h-3.5 w-3.5 text-brand-600" />
                    <span>Execution Steps</span>
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-slate-600">
                    {rec.steps.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ol>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium capitalize text-slate-600">
                    {rec.status === 'implemented' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                    )}
                    Status: {rec.status}
                  </span>

                  <div className="flex gap-2">
                    {rec.status === 'pending' && (
                      <button
                        onClick={() => updateRecommendationStatus(rec.id, 'approved')}
                        className="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
                      >
                        Approve Plan
                      </button>
                    )}
                    {rec.status === 'approved' && (
                      <button
                        onClick={() => updateRecommendationStatus(rec.id, 'implemented')}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700"
                      >
                        Mark Implemented
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
