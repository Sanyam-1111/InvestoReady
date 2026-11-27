import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { formatCurrency } from '../../utils/formatters';

export const InvestmentSimulatorPage: React.FC = () => {
  const [investmentAmount, setInvestmentAmount] = useState(2000000);
  const [preMoneyVal, setPreMoneyVal] = useState(14000000);
  const [optionPoolPct, setOptionPoolPct] = useState(10);
  const [seriesADilutionPct, setSeriesADilutionPct] = useState(20);
  const [seriesBDilutionPct, setSeriesBDilutionPct] = useState(15);

  const postMoneyVal = preMoneyVal + investmentAmount;
  const initialOwnershipPct = (investmentAmount / postMoneyVal) * 100;
  const afterSeriesAOwnership = initialOwnershipPct * (1 - seriesADilutionPct / 100);
  const afterSeriesBOwnership = afterSeriesAOwnership * (1 - seriesBDilutionPct / 100);
  const founderAndExistingPct = Math.max(0, 100 - initialOwnershipPct - optionPoolPct);

  const ownershipStages = useMemo(
    () => [
      { stage: 'At Entry', investor: Number(initialOwnershipPct.toFixed(2)), others: Number((100 - initialOwnershipPct).toFixed(2)) },
      { stage: 'Post Series A', investor: Number(afterSeriesAOwnership.toFixed(2)), others: Number((100 - afterSeriesAOwnership).toFixed(2)) },
      { stage: 'Post Series B', investor: Number(afterSeriesBOwnership.toFixed(2)), others: Number((100 - afterSeriesBOwnership).toFixed(2)) },
    ],
    [initialOwnershipPct, afterSeriesAOwnership, afterSeriesBOwnership]
  );

  const exitMultiples = [
    { label: '1x (Base Exit)', exitVal: postMoneyVal },
    { label: '3x (Growth Exit)', exitVal: postMoneyVal * 3 },
    { label: '5x (Strong Exit)', exitVal: postMoneyVal * 5 },
    { label: '10x (Breakout)', exitVal: postMoneyVal * 10 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investment & Dilution Simulator"
        subtitle="Model check size, pre/post-money valuation, multi-round dilution, and exit return multiples."
      />

      {/* Top Metrics */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Post-Money Valuation</p>
          <p className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(postMoneyVal, true)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Entry Ownership</p>
          <p className="mt-1 font-mono text-xl font-semibold text-brand-600 tabular-nums">
            {initialOwnershipPct.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Diluted Ownership (Post-B)</p>
          <p className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
            {afterSeriesBOwnership.toFixed(2)}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Remaining Founder / Existing</p>
          <p className="mt-1 font-mono text-xl font-semibold text-emerald-700 tabular-nums">
            {founderAndExistingPct.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Simulator Inputs */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Deal Parameters</h3>
            <ProvenanceBadge type="projected" compact />
          </div>

          <div>
            <div className="flex justify-between font-medium">
              <span>Investment Check Size</span>
              <span className="font-mono text-brand-600">{formatCurrency(investmentAmount, true)}</span>
            </div>
            <input
              type="range"
              min="250000"
              max="6000000"
              step="250000"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium">
              <span>Pre-Money Valuation</span>
              <span className="font-mono text-slate-900">{formatCurrency(preMoneyVal, true)}</span>
            </div>
            <input
              type="range"
              min="5000000"
              max="40000000"
              step="500000"
              value={preMoneyVal}
              onChange={(e) => setPreMoneyVal(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium">
              <span>Target Option Pool</span>
              <span className="font-mono text-slate-900">{optionPoolPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              value={optionPoolPct}
              onChange={(e) => setOptionPoolPct(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="font-medium text-slate-700">Series A Dilution %</label>
              <input
                type="number"
                min="0"
                max="50"
                value={seriesADilutionPct}
                onChange={(e) => setSeriesADilutionPct(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono outline-none"
              />
            </div>
            <div>
              <label className="font-medium text-slate-700">Series B Dilution %</label>
              <input
                type="number"
                min="0"
                max="50"
                value={seriesBDilutionPct}
                onChange={(e) => setSeriesBDilutionPct(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 font-mono outline-none"
              />
            </div>
          </div>
        </div>

        {/* Dilution Chart + Exit Table */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold text-slate-900">
              Investor Equity Ownership Across Future Rounds
            </h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ownershipStages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#64748B' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    formatter={(v: number) => `${v}%`}
                    contentStyle={{ borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                  />
                  <Bar dataKey="investor" name="Your Stake %" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="border-b border-slate-200 px-5 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Simulated Exit Proceeds (Assuming Post-B Diluted Stake of {afterSeriesBOwnership.toFixed(2)}%)
              </h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-2.5">Exit Scenario</th>
                  <th className="px-4 py-2.5 text-right">Exit Valuation</th>
                  <th className="px-4 py-2.5 text-right">Gross Proceeds</th>
                  <th className="px-5 py-2.5 text-right">MOIC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exitMultiples.map((row) => {
                  const proceeds = (row.exitVal * afterSeriesBOwnership) / 100;
                  const moic = proceeds / investmentAmount;
                  return (
                    <tr key={row.label} className="hover:bg-slate-50">
                      <td className="px-5 py-2.5 font-medium text-slate-900">{row.label}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(row.exitVal, true)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                        {formatCurrency(Math.round(proceeds), true)}
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono font-semibold text-brand-600 tabular-nums">
                        {moic.toFixed(2)}x
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
