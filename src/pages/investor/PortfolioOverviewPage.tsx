import React from 'react';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const PortfolioOverviewPage: React.FC = () => {
  const { portfolioCompanies, setSelectedCompanyId, questions } = usePlatform();
  const navigate = useNavigate();

  const totalInvested = portfolioCompanies.reduce((acc, c) => acc + c.investedAmount, 0);
  const impliedHoldingValue = portfolioCompanies.reduce(
    (acc, c) => acc + (c.currentValuation * c.ownershipPct) / 100,
    0
  );
  const avgConfidence = Math.round(
    portfolioCompanies.reduce((acc, c) => acc + c.confidenceScore, 0) / portfolioCompanies.length
  );
  const pendingQuestions = questions.filter((q) => q.status === 'pending').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio Overview"
        subtitle="Real-time financial health, confidence scores, and disclosure status across your portfolio."
        badge="Horizon Ventures View"
      />

      {/* Top Portfolio KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Total Invested Capital</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(totalInvested)}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Across {portfolioCompanies.length} active companies</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Implied Portfolio Value</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-emerald-600 tabular-nums">
            {formatCurrency(Math.round(impliedHoldingValue))}
          </p>
          <p className="mt-1 text-[11px] text-emerald-700">
            {(impliedHoldingValue / totalInvested).toFixed(2)}x TVPI (unrealized)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Avg. Confidence Score</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-brand-600 tabular-nums">
            {avgConfidence} / 100
          </p>
          <p className="mt-1 text-[11px] text-slate-400">Weighted by bank &amp; GL reconciliation</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Open Founder Questions</p>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {pendingQuestions}
          </p>
          <button
            onClick={() => navigate('/investor/questions')}
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-brand-600 hover:text-brand-700"
          >
            <span>Open Q&amp;A thread</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Portfolio Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Portfolio Companies</h2>
          </div>
          <span className="text-xs text-slate-500">Click any company to inspect transparency</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Company</th>
                <th className="px-4 py-3 text-right">ARR</th>
                <th className="px-4 py-3 text-right">Cash</th>
                <th className="px-4 py-3 text-right">Runway</th>
                <th className="px-4 py-3 text-right">Reconciled</th>
                <th className="px-4 py-3 text-center">Confidence</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {portfolioCompanies.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{c.name}</span>
                      {c.isPrimaryDemo && (
                        <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                          Live Synced
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {c.sector} · {c.stage}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-900 tabular-nums">
                    {formatCurrency(c.arr, true)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    {formatCurrency(c.cashBalance, true)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    <span className={c.runwayMonths < 10 ? 'font-semibold text-rose-600' : ''}>
                      {c.runwayMonths} mos
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-700 tabular-nums">
                    {c.reconciliationCoveragePct}%
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold ${
                        c.confidenceScore >= 85
                          ? 'bg-emerald-50 text-emerald-700'
                          : c.confidenceScore >= 75
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      {c.confidenceScore}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => {
                        setSelectedCompanyId(c.id);
                        navigate('/investor/transparency');
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
