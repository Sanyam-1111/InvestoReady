import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { MONTHLY_FINANCIALS, usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { transactions } = usePlatform();
  const [period, setPeriod] = useState<'3M' | '6M' | '12M'>('12M');
  const [department, setDepartment] = useState<string>('All');

  const slicedMonths = useMemo(() => {
    if (period === '3M') return MONTHLY_FINANCIALS.slice(-3);
    if (period === '6M') return MONTHLY_FINANCIALS.slice(-6);
    return MONTHLY_FINANCIALS;
  }, [period]);

  const deptSpend = useMemo(() => {
    const map: Record<string, number> = {
      Engineering: 0,
      Infrastructure: 0,
      'Sales & Marketing': 0,
      'G&A': 0,
    };
    transactions
      .filter((t) => t.type === 'outflow')
      .forEach((t) => {
        if (map[t.department] !== undefined) {
          map[t.department] += t.amount;
        }
      });
    return Object.entries(map).map(([name, amount]) => ({ name, amount }));
  }, [transactions]);

  const categorySpend = useMemo(() => {
    const filtered = transactions.filter(
      (t) => t.type === 'outflow' && (department === 'All' || t.department === department)
    );
    const map: Record<string, number> = {};
    filtered.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        sharePct: ((amount / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, department]);

  const vendorTable = useMemo(() => {
    const filtered = transactions.filter(
      (t) => t.type === 'outflow' && (department === 'All' || t.department === department)
    );
    const total = filtered.reduce((acc, t) => acc + t.amount, 0) || 1;
    return filtered
      .map((t) => ({
        vendor: t.vendor,
        category: t.category,
        department: t.department,
        amount: t.amount,
        share: ((t.amount / total) * 100).toFixed(1),
        provenance: t.provenance,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions, department]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analytics"
        subtitle="Multi-month profitability trends, department budgets, and vendor spend concentration."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-brand-500"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Sales & Marketing">Sales &amp; Marketing</option>
              <option value="G&A">G&amp;A</option>
            </select>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['3M', '6M', '12M'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-md px-2.5 py-1 font-medium ${
                    period === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Gross &amp; Net Margin Trajectory
              </h2>
              <p className="text-xs text-slate-500">Margin expansion as revenue scales over fixed OpEx</p>
            </div>
            <ProvenanceBadge type="accounting_derived" compact />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={slicedMonths}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(v: number) => `${v.toFixed(1)}%`}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="grossMarginPct"
                  name="Gross Margin %"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="netMarginPct"
                  name="Net Margin %"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Department Spending</h2>
              <p className="text-xs text-slate-500">November 2026 cash outflow allocation</p>
            </div>
            <ProvenanceBadge type="bank_derived" compact />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptSpend} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 11, fill: '#334155' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="amount" name="Spend" fill="#4F46E5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense Categories + Vendor Table */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <h3 className="text-sm font-semibold text-slate-900">Expense Breakdown</h3>
          <p className="text-xs text-slate-500">Filtered by: {department}</p>
          <div className="mt-4 space-y-3.5">
            {categorySpend.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {formatCurrency(item.amount)} ({item.sharePct}%)
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand-600"
                    style={{ width: `${Math.min(100, Number(item.sharePct))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Vendor Spend Concentration</h3>
              <p className="text-xs text-slate-500">Top outbound vendors across active ledgers</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-2.5 pr-3">Vendor</th>
                  <th className="py-2.5 pr-3">Department</th>
                  <th className="py-2.5 pr-3">Provenance</th>
                  <th className="py-2.5 pr-3 text-right">Share</th>
                  <th className="py-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorTable.map((row) => (
                  <tr key={`${row.vendor}-${row.amount}`} className="hover:bg-slate-50/70">
                    <td className="py-2.5 pr-3 font-medium text-slate-900">{row.vendor}</td>
                    <td className="py-2.5 pr-3 text-slate-600">{row.department}</td>
                    <td className="py-2.5 pr-3">
                      <ProvenanceBadge type={row.provenance} compact />
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono text-slate-500 tabular-nums">
                      {row.share}%
                    </td>
                    <td className="py-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {formatCurrency(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
