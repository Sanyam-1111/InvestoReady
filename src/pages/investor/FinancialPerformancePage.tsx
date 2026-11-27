import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MetricCard } from '../../components/shared/MetricCard';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { RestrictedAccessCard } from '../../components/shared/RestrictedAccessCard';
import { CORE_METRICS, MONTHLY_FINANCIALS, usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/formatters';

export const FinancialPerformancePage: React.FC = () => {
  const { permissions, selectedCompany } = usePlatform();
  const [range, setRange] = useState<'6M' | '12M'>('12M');

  const data = range === '6M' ? MONTHLY_FINANCIALS.slice(-6) : MONTHLY_FINANCIALS;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Performance"
        subtitle={`Source-linked P&L, cash runway, and historical metrics for ${selectedCompany.name}.`}
        badge={`Confidence ${selectedCompany.confidenceScore}/100`}
        actions={
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
        }
      />

      {/* Revenue & Burn KPIs respecting permissions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {permissions.shareRevenueAndGrowth ? (
          <>
            <MetricCard metric={CORE_METRICS.mrr} />
            <MetricCard metric={CORE_METRICS.gross_margin} />
          </>
        ) : (
          <div className="sm:col-span-2">
            <RestrictedAccessCard
              sectionName="Revenue & Growth Metrics"
              permissionLabel="Share Revenue & Growth Metrics"
            />
          </div>
        )}

        {permissions.shareBurnAndRunway ? (
          <>
            <MetricCard metric={CORE_METRICS.cash_balance} />
            <MetricCard metric={CORE_METRICS.runway} />
          </>
        ) : (
          <div className="sm:col-span-2">
            <RestrictedAccessCard
              sectionName="Cash, Burn & Runway"
              permissionLabel="Share Cash, Burn & Runway"
            />
          </div>
        )}
      </div>

      {/* Historical Chart */}
      {permissions.shareRevenueAndGrowth && permissions.shareExpenseBreakdown ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Historical Revenue vs. Operating Expenses
              </h2>
              <p className="text-xs text-slate-500">Click any KPI card above to inspect provenance</p>
            </div>
            <ProvenanceBadge type="accounting_derived" compact />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <RestrictedAccessCard
          sectionName="Detailed Expense Breakdown & Comparison"
          permissionLabel="Share Detailed Expense Breakdown"
        />
      )}

      {/* Historical Statement Table */}
      {permissions.shareRevenueAndGrowth && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-200 px-5 py-3.5">
            <h3 className="text-sm font-semibold text-slate-900">Monthly Financial Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3 text-right">Revenue</th>
                  <th className="px-4 py-3 text-right">Gross Margin</th>
                  {permissions.shareBurnAndRunway && <th className="px-4 py-3 text-right">Net Burn</th>}
                  {permissions.shareBurnAndRunway && <th className="px-4 py-3 text-right">Ending Cash</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/70">
                    <td className="px-4 py-2.5 font-medium text-slate-900">{row.month}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-800 tabular-nums">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-700 tabular-nums">
                      {row.grossMarginPct.toFixed(1)}%
                    </td>
                    {permissions.shareBurnAndRunway && (
                      <td className="px-4 py-2.5 text-right font-mono text-rose-600 tabular-nums">
                        -{formatCurrency(row.netBurn)}
                      </td>
                    )}
                    {permissions.shareBurnAndRunway && (
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {formatCurrency(row.cashBalance)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
