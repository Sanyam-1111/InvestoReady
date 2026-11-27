import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitCompare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { CORE_METRICS, MONTHLY_FINANCIALS, usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const OverviewPage: React.FC = () => {
  const {
    confidenceScore,
    reconciliationCoveragePct,
    reconciliationItems,
    transactions,
    findings,
    openTraceMetric,
  } = usePlatform();
  const navigate = useNavigate();
  const [range, setRange] = useState<'6M' | '12M'>('12M');

  const chartData = range === '6M' ? MONTHLY_FINANCIALS.slice(-6) : MONTHLY_FINANCIALS;
  const openFindingsSavings = findings
    .filter((f) => f.classification !== 'legitimate_monitored' && f.status !== 'dismissed')
    .reduce((acc, f) => acc + f.estimatedMonthlySavings, 0);
  const pendingRecs = reconciliationItems.filter((r) => r.status !== 'matched').length;
  const unconfirmedAi = transactions.filter(
    (t) => t.provenance === 'ai_extracted' && !t.humanConfirmed
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Overview"
        subtitle="Real-time financial health, cash runway, and provenance status for Meridian Cloud Inc."
        badge="Nov 2026 Close"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/founder/reconciliation')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <GitCompare className="h-3.5 w-3.5 text-slate-500" />
              <span>Reconciliation ({reconciliationCoveragePct}%)</span>
            </button>
            <button
              onClick={() => navigate('/founder/advisor')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        }
      />

      {/* Executive Health Banner */}
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:grid-cols-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-mono text-sm font-bold text-emerald-700">
            {confidenceScore}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Confidence Score</p>
            <p className="text-[11px] text-slate-500">Out of 100 · Investor-shared</p>
          </div>
        </div>
        <button
          onClick={() => openTraceMetric('burn_multiple')}
          className="flex flex-col justify-center border-b border-slate-100 pb-3 text-left sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4"
        >
          <p className="text-[11px] font-medium text-slate-500">Burn Multiple (Click to trace)</p>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-slate-900">1.34x</span>
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
              Efficient
            </span>
          </div>
        </button>
        <button
          onClick={() => openTraceMetric('ar_balance')}
          className="flex flex-col justify-center border-b border-slate-100 pb-3 text-left sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4"
        >
          <p className="text-[11px] font-medium text-slate-500">AR / AP Position</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            $94.2k AR · $41.9k AP
          </p>
        </button>
        <button
          onClick={() => navigate('/founder/optimizer')}
          className="flex items-center justify-between rounded-xl bg-brand-50/70 px-3 py-2 text-left transition-colors hover:bg-brand-50"
        >
          <div>
            <p className="text-[11px] font-semibold text-brand-700">Savings Opportunity</p>
            <p className="font-mono text-sm font-bold text-brand-900">
              {formatCurrency(openFindingsSavings)}/mo
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-brand-600" />
        </button>
      </div>

      {/* 6 Primary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard metric={CORE_METRICS.cash_balance} />
        <MetricCard metric={CORE_METRICS.mrr} />
        <MetricCard metric={CORE_METRICS.net_burn} />
        <MetricCard metric={CORE_METRICS.runway} />
        <MetricCard metric={CORE_METRICS.gross_margin} />
        <MetricCard metric={CORE_METRICS.net_profit_loss} />
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue vs Expenses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Revenue vs. Operating Expenses
                </h2>
                <ProvenanceBadge type="accounting_derived" compact />
              </div>
              <p className="text-xs text-slate-500">
                Monthly accrual performance across synced QuickBooks &amp; Stripe feeds
              </p>
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['6M', '12M'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2.5 py-1 font-medium ${
                    range === r ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Total Expenses" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Balance Trend */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900">Cash Balance</h2>
                <ProvenanceBadge type="bank_derived" compact />
              </div>
              <p className="text-xs text-slate-500">Mercury Checking + Treasury</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: number) => formatCurrency(val)}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="cashBalance"
                  name="Cash Balance"
                  stroke="#059669"
                  strokeWidth={2}
                  fill="url(#cashGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Alerts, AI Insights, Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Important Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Important Alerts</h3>
            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
              {pendingRecs + unconfirmedAi} Actionable
            </span>
          </div>
          <div className="mt-4 space-y-3">
            <button
              onClick={() => navigate('/founder/reconciliation')}
              className="flex w-full items-start gap-3 rounded-xl border border-rose-200/80 bg-rose-50/50 p-3 text-left transition-colors hover:bg-rose-50"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {pendingRecs} Reconciliation Items Pending
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  Includes $14,200 unmatched Stripe settlement &amp; $720 Datadog variance.
                </p>
              </div>
            </button>
            <button
              onClick={() => navigate('/founder/transactions')}
              className="flex w-full items-start gap-3 rounded-xl border border-amber-200/80 bg-amber-50/50 p-3 text-left transition-colors hover:bg-amber-50"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-xs font-semibold text-slate-900">
                  {unconfirmedAi} AI-Extracted PDF Needs Review
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  Vanguard Legal LLP ($6,400) remains flagged until human confirmation.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">AI Intelligence Highlights</h3>
            <ProvenanceBadge type="ai_extracted" compact />
          </div>
          <div className="mt-4 space-y-3 text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                <span>Gross Margin Rebound (+3.4 pts)</span>
              </div>
              <p className="mt-1 text-slate-600">
                November margin returned to 79.0% after October&apos;s $4.8k staging migration spike.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>Zero-Impact Waste Isolated</span>
              </div>
              <p className="mt-1 text-slate-600">
                Canceling overlapping ZoomInfo seats &amp; idle SaaS licenses saves $6,280/mo with
                low operational risk.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Recent Ledger Activity</h3>
            <button
              onClick={() => navigate('/founder/transactions')}
              className="text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              View all
            </button>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 text-xs">
                <div className="min-w-0 pr-3">
                  <p className="truncate font-medium text-slate-800">{tx.vendor}</p>
                  <p className="truncate text-[11px] text-slate-400">
                    {tx.date} · {tx.category}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-mono font-semibold tabular-nums ${
                      tx.type === 'inflow' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {tx.type === 'inflow' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                    <CheckCircle2 className="h-2.5 w-2.5" />
                    {tx.reconciliationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
