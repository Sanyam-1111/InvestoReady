import React, { useState } from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';

export const InvestorSettingsPage: React.FC = () => {
  const { notify } = usePlatform();
  const [firmName, setFirmName] = useState('Horizon Ventures');
  const [minConfidenceAlert, setMinConfidenceAlert] = useState(75);
  const [minRunwayAlert, setMinRunwayAlert] = useState(9);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investor Portal Settings"
        subtitle="Configure fund profile and automated financial transparency alert thresholds."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            notify('Settings saved', 'Investor alert thresholds updated.');
          }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Fund &amp; Alert Thresholds</h2>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="font-medium text-slate-700">Firm / Fund Name</label>
              <input
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium">
                <span>Alert if Confidence Score drops below</span>
                <span className="font-mono text-brand-600">{minConfidenceAlert}/100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                value={minConfidenceAlert}
                onChange={(e) => setMinConfidenceAlert(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-medium">
                <span>Alert if Cash Runway drops below</span>
                <span className="font-mono text-rose-600">{minRunwayAlert} months</span>
              </div>
              <input
                type="range"
                min="3"
                max="18"
                value={minRunwayAlert}
                onChange={(e) => setMinRunwayAlert(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
            >
              Save Preferences
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Bell className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">Active Watchlist Triggers</h2>
          </div>
          <div className="mt-4 space-y-3 text-slate-600">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Kinetix BioOps Triggered</p>
              <p className="mt-0.5">
                Confidence Score (69/100) and Runway (8.0 mos) are below your portfolio guardrails.
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">Meridian Cloud Inc. Healthy</p>
              <p className="mt-0.5">
                Confidence Score (88/100) and Runway (20.8 mos) satisfy all portfolio thresholds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
