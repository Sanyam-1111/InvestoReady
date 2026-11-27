import React from 'react';
import { ArrowDownRight, ArrowUpRight, GitMerge } from 'lucide-react';
import { MetricProvenance } from '../../types/finance';
import { usePlatform } from '../../context/PlatformContext';
import { ProvenanceBadge } from './ProvenanceBadge';

interface MetricCardProps {
  metric: MetricProvenance;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, subtitle }) => {
  const { openTraceMetric, roleMode, permissions } = usePlatform();
  const canTrace = roleMode === 'founder' || permissions.allowProvenanceDrilldown;

  return (
    <button
      type="button"
      onClick={() => canTrace && openTraceMetric(metric)}
      className={`group relative flex w-full flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 text-left shadow-card transition-all ${
        canTrace
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md'
          : 'cursor-default'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{metric.label}</span>
        <ProvenanceBadge type={metric.provenance} compact />
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="font-mono text-2xl font-semibold tracking-tight text-slate-900 tabular-nums">
          {metric.formattedValue}
        </span>
        {metric.delta && (
          <span
            className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${
              metric.deltaPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {metric.deltaPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {metric.delta}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-500">
        <span className="truncate">{subtitle || metric.sourceLabel}</span>
        {canTrace && (
          <span className="inline-flex shrink-0 items-center gap-1 font-medium text-brand-600 opacity-75 transition-opacity group-hover:opacity-100">
            <GitMerge className="h-3 w-3" />
            Trace
          </span>
        )}
      </div>
    </button>
  );
};
