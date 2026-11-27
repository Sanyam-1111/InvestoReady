import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { formatCurrency } from '../../utils/formatters';

export const ScenarioSimulatorPage: React.FC = () => {
  const [plannedHires, setPlannedHires] = useState(1);
  const [applyOptimizerSavings, setApplyOptimizerSavings] = useState(true);
  const [priceUpliftPct, setPriceUpliftPct] = useState(5);
  const [fundraiseAmount, setFundraiseAmount] = useState(0);

  const baseNetBurn = 88400;
  const hireCost = plannedHires * 13500;
  const optimizerSavings = applyOptimizerSavings ? 11080 : 0;
  const revenueLift = Math.round(148500 * (priceUpliftPct / 100));
  const simulatedBurn = Math.max(5000, baseNetBurn + hireCost - optimizerSavings - revenueLift);
  const startingCash = 1842400 + fundraiseAmount * 1000000;
  const baseRunway = Number((1842400 / baseNetBurn).toFixed(1));
  const simulatedRunway = Number((startingCash / simulatedBurn).toFixed(1));

  const comparisonData = useMemo(() => {
    const points = [];
    let baseCash = 1842400;
    let simCash = startingCash;
    for (let m = 0; m <= 12; m++) {
      points.push({
        month: `M${m}`,
        baseline: Math.max(0, Math.round(baseCash)),
        simulated: Math.max(0, Math.round(simCash)),
      });
      baseCash -= baseNetBurn;
      simCash -= simulatedBurn;
    }
    return points;
  }, [startingCash, simulatedBurn]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="What-If Scenario Simulator"
        subtitle="Model hiring plans, pricing changes, expense cuts, and capital raises side-by-side."
        actions={
          <button
            onClick={() => {
              setPlannedHires(0);
              setApplyOptimizerSavings(true);
              setPriceUpliftPct(0);
              setFundraiseAmount(0);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reset Sliders
          </button>
        }
      />

      {/* Comparison Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Simulated Net Burn</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(simulatedBurn)}/mo
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Baseline: {formatCurrency(baseNetBurn)}/mo
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Simulated Runway</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-brand-600 tabular-nums">
            {simulatedRunway} mos
          </p>
          <p className="mt-1 text-xs text-emerald-700">
            {simulatedRunway >= baseRunway ? '+' : ''}
            {(simulatedRunway - baseRunway).toFixed(1)} mos vs baseline ({baseRunway} mos)
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">Month-12 Ending Cash</span>
            <ProvenanceBadge type="projected" compact />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
            {formatCurrency(comparisonData[12].simulated)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Baseline M12: {formatCurrency(comparisonData[12].baseline)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Controls */}
        <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs">
          <h3 className="text-sm font-semibold text-slate-900">Scenario Controls</h3>

          <div>
            <div className="flex justify-between font-medium">
              <span>Planned FTE Hires ($13.5k/mo ea)</span>
              <span className="font-mono text-slate-900">{plannedHires} hires</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              value={plannedHires}
              onChange={(e) => setPlannedHires(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium">
              <span>Pricing / Packaging Uplift</span>
              <span className="font-mono text-emerald-600">+{priceUpliftPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={priceUpliftPct}
              onChange={(e) => setPriceUpliftPct(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium">
              <span>Bridge / Extension Capital</span>
              <span className="font-mono text-brand-600">+${fundraiseAmount.toFixed(1)}M</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={fundraiseAmount}
              onChange={(e) => setFundraiseAmount(Number(e.target.value))}
              className="mt-2 w-full accent-brand-600"
            />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div>
              <p className="font-semibold text-slate-900">Apply Optimizer Savings</p>
              <p className="text-[11px] text-slate-500">Save $11,080/mo from identified waste</p>
            </div>
            <input
              type="checkbox"
              checked={applyOptimizerSavings}
              onChange={(e) => setApplyOptimizerSavings(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
          </label>
        </div>

        {/* Comparison Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">
            Baseline vs. Simulated Cash Trajectory (12 Months)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
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
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline Cash"
                  stroke="#94A3B8"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="simulated"
                  name="Simulated Scenario"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
