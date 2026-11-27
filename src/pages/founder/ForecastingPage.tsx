import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { formatCurrency } from '../../utils/formatters';

export const ForecastingPage: React.FC = () => {
  const [horizon, setHorizon] = useState<6 | 12 | 18>(12);
  const [caseType, setCaseType] = useState<'base' | 'upside' | 'downside'>('base');
  const [monthlyGrowthPct, setMonthlyGrowthPct] = useState(4.5);
  const [expenseGrowthPct, setExpenseGrowthPct] = useState(1.2);

  const applyCasePreset = (nextCase: 'base' | 'upside' | 'downside') => {
    setCaseType(nextCase);
    if (nextCase === 'upside') {
      setMonthlyGrowthPct(7.0);
      setExpenseGrowthPct(1.5);
    } else if (nextCase === 'downside') {
      setMonthlyGrowthPct(1.5);
      setExpenseGrowthPct(2.0);
    } else {
      setMonthlyGrowthPct(4.5);
      setExpenseGrowthPct(1.2);
    }
  };

  const forecastRows = useMemo(() => {
    const rows = [];
    let rev = 148500;
    let exp = 236900;
    let cash = 1842400;
    const monthNames = [
      'Dec 26', 'Jan 27', 'Feb 27', 'Mar 27', 'Apr 27', 'May 27',
      'Jun 27', 'Jul 27', 'Aug 27', 'Sep 27', 'Oct 27', 'Nov 27',
      'Dec 27', 'Jan 28', 'Feb 28', 'Mar 28', 'Apr 28', 'May 28',
    ];
    for (let i = 0; i < horizon; i++) {
      rev = Math.round(rev * (1 + monthlyGrowthPct / 100));
      exp = Math.round(exp * (1 + expenseGrowthPct / 100));
      const netBurn = exp - rev;
      cash = Math.max(0, cash - netBurn);
      rows.push({
        month: monthNames[i],
        revenue: rev,
        expenses: exp,
        netBurn,
        cashBalance: cash,
      });
    }
    return rows;
  }, [horizon, monthlyGrowthPct, expenseGrowthPct]);

  const endingCash = forecastRows[forecastRows.length - 1]?.cashBalance ?? 0;
  const endingRev = forecastRows[forecastRows.length - 1]?.revenue ?? 0;
  const breakEvenMonth = forecastRows.find((r) => r.netBurn <= 0)?.month || 'Beyond horizon';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Forecasting"
        subtitle="Forward cash, revenue, and burn projections modeled from verified November run-rates."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['base', 'upside', 'downside'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => applyCasePreset(c)}
                  className={`rounded-md px-2.5 py-1 font-medium capitalize ${
                    caseType === c ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {c} Case
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {([6, 12, 18] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`rounded-md px-2.5 py-1 font-medium ${
                    horizon === h ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {h}M
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Projected Cash ({horizon}M)</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(endingCash)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Projected Exit MRR</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-brand-600 tabular-nums">
            {formatCurrency(endingRev)}/mo
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Cash-Flow Break-Even</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-emerald-600">{breakEvenMonth}</p>
        </div>
      </div>

      {/* Drivers + Chart */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900">Forecast Drivers</h3>
          <p className="mt-1 text-xs text-slate-500">Adjust run-rate assumptions</p>
          <div className="mt-5 space-y-5 text-xs">
            <div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Monthly Revenue Growth</span>
                <span className="font-mono text-brand-600">{monthlyGrowthPct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={monthlyGrowthPct}
                onChange={(e) => setMonthlyGrowthPct(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>
            <div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">Monthly Expense Growth</span>
                <span className="font-mono text-slate-900">{expenseGrowthPct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="-2"
                max="6"
                step="0.2"
                value={expenseGrowthPct}
                onChange={(e) => setExpenseGrowthPct(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Projected Cash Runway Curve</h3>
            <ProvenanceBadge type="projected" compact />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastRows}>
                <defs>
                  <linearGradient id="projCash" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
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
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="cashBalance"
                  name="Projected Cash"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#projCash)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Forecast Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3 text-right">Projected Revenue</th>
                <th className="px-4 py-3 text-right">Projected Expenses</th>
                <th className="px-4 py-3 text-right">Net Burn / Surplus</th>
                <th className="px-4 py-3 text-right">Ending Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {forecastRows.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/70">
                  <td className="px-4 py-2.5 font-medium text-slate-900">{row.month}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-700 tabular-nums">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-700 tabular-nums">
                    {formatCurrency(row.expenses)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-mono font-semibold tabular-nums ${
                      row.netBurn <= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {row.netBurn <= 0
                      ? `+${formatCurrency(Math.abs(row.netBurn))}`
                      : `-${formatCurrency(row.netBurn)}`}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(row.cashBalance)}
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
