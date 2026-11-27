import React, { useState } from 'react';
import { Building2, CheckCircle2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';

export const SettingsPage: React.FC = () => {
  const { notify } = usePlatform();
  const [companyName, setCompanyName] = useState('Meridian Cloud Inc.');
  const [accountingBasis, setAccountingBasis] = useState('Accrual (GAAP-Aligned)');
  const [fiscalStart, setFiscalStart] = useState('January');
  const [syncingSource, setSyncingSource] = useState<string | null>(null);

  const sources = [
    { name: 'Mercury Checking & Treasury', type: 'Bank Feed', status: 'Connected (Simulated)', lastSync: '18 mins ago' },
    { name: 'QuickBooks Online', type: 'Accounting GL', status: 'Connected (Simulated)', lastSync: '30 mins ago' },
    { name: 'Stripe Billing', type: 'Revenue Sub-ledger', status: 'Connected (Simulated)', lastSync: '30 mins ago' },
    { name: 'Ramp Corporate Card', type: 'Card Spend Feed', status: 'Connected (Simulated)', lastSync: '45 mins ago' },
  ];

  const handleSync = (sourceName: string) => {
    setSyncingSource(sourceName);
    window.setTimeout(() => {
      setSyncingSource(null);
      notify('Feed synced', `${sourceName} demo snapshot refreshed.`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workspace Settings"
        subtitle="Manage company financial profile, connected data sources, and demo environment controls."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            notify('Profile saved', 'Company configuration updated for this session.');
          }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Company Profile</h2>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-medium text-slate-700">Legal Entity Name</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-slate-700">Accounting Basis</label>
                <select
                  value={accountingBasis}
                  onChange={(e) => setAccountingBasis(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none"
                >
                  <option>Accrual (GAAP-Aligned)</option>
                  <option>Cash Basis</option>
                </select>
              </div>
              <div>
                <label className="font-medium text-slate-700">Fiscal Year Start</label>
                <select
                  value={fiscalStart}
                  onChange={(e) => setFiscalStart(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none"
                >
                  <option>January</option>
                  <option>April</option>
                  <option>July</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
            >
              Save Workspace Profile
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs">
          <h2 className="border-b border-slate-100 pb-3 text-sm font-semibold text-slate-900">
            Connected Data Feeds
          </h2>
          <div className="mt-3 divide-y divide-slate-100">
            {sources.map((src) => (
              <div key={src.name} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold text-slate-900">{src.name}</p>
                  <p className="text-[11px] text-slate-500">
                    {src.type} · Synced {src.lastSync}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    {src.status}
                  </span>
                  <button
                    onClick={() => handleSync(src.name)}
                    className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                    title="Trigger sync"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${syncingSource === src.name ? 'animate-spin' : ''}`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
