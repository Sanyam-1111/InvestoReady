import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { CORE_METRICS, usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const CompaniesPage: React.FC = () => {
  const {
    portfolioCompanies,
    selectedCompany,
    setSelectedCompanyId,
    permissions,
  } = usePlatform();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Companies Directory"
        subtitle="Select a portfolio company to inspect source-linked metrics, holdings, and data access."
      />

      {/* Company Switcher Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {portfolioCompanies.map((comp) => {
          const active = comp.id === selectedCompany.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedCompanyId(comp.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'border-brand-600 bg-brand-50/30 shadow-sm ring-1 ring-brand-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-700">
                  {comp.stage}
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-700">
                  Score {comp.confidenceScore}/100
                </span>
              </div>
              <h3 className="mt-2.5 text-base font-semibold text-slate-900">{comp.name}</h3>
              <p className="text-xs text-slate-500">{comp.sector}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs">
                <span className="text-slate-500">ARR {formatCurrency(comp.arr, true)}</span>
                <span className="font-mono text-slate-700">Own {comp.ownershipPct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Company Detail */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900">{selectedCompany.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Confidence {selectedCompany.confidenceScore}/100
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {selectedCompany.sector} · Founded {selectedCompany.founded} · Valuation{' '}
              {formatCurrency(selectedCompany.currentValuation, true)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate('/investor/transparency')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-slate-800"
            >
              <span>Inspect Provenance &amp; Score</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => navigate('/investor/questions')}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Ask Founder
            </button>
          </div>
        </div>

        {selectedCompany.id === 'meridian-cloud' ? (
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {permissions.shareBurnAndRunway && <MetricCard metric={CORE_METRICS.cash_balance} />}
              {permissions.shareRevenueAndGrowth && <MetricCard metric={CORE_METRICS.mrr} />}
              {permissions.shareBurnAndRunway && <MetricCard metric={CORE_METRICS.runway} />}
              {permissions.shareRevenueAndGrowth && <MetricCard metric={CORE_METRICS.gross_margin} />}
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
              <p className="font-semibold text-slate-900">Founder-Granted Data Room Scope</p>
              <div className="mt-2.5 flex flex-wrap gap-3 text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Provenance Drill-Down: {permissions.allowProvenanceDrilldown ? 'Allowed' : 'Restricted'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Reconciliation Logs: {permissions.shareReconciliationDiscrepancies ? 'Shared' : 'Restricted'}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Expense Breakdown: {permissions.shareExpenseBreakdown ? 'Shared' : 'Restricted'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-4 text-xs">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500">ARR</p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {formatCurrency(selectedCompany.arr, true)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500">Cash Balance</p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {formatCurrency(selectedCompany.cashBalance, true)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500">Runway</p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {selectedCompany.runwayMonths} mos
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-slate-500">Burn Multiple</p>
              <p className="mt-1 font-mono text-xl font-semibold text-slate-900">
                {selectedCompany.burnMultiple}x
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
