import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';

interface CommandItem {
  label: string;
  group: string;
  path: string;
  role: 'founder' | 'investor';
}

const COMMAND_ITEMS: CommandItem[] = [
  { label: 'Overview', group: 'Founder', path: '/founder/overview', role: 'founder' },
  { label: 'Financial Analytics', group: 'Founder', path: '/founder/analytics', role: 'founder' },
  { label: 'Transactions Ledger', group: 'Founder', path: '/founder/transactions', role: 'founder' },
  { label: 'Bank Reconciliation', group: 'Founder', path: '/founder/reconciliation', role: 'founder' },
  { label: 'Expense Optimizer', group: 'Founder', path: '/founder/optimizer', role: 'founder' },
  { label: 'AI Financial Advisor', group: 'Founder', path: '/founder/advisor', role: 'founder' },
  { label: 'Forecasting', group: 'Founder', path: '/founder/forecasting', role: 'founder' },
  { label: 'Scenario Simulator', group: 'Founder', path: '/founder/scenarios', role: 'founder' },
  { label: 'Recommendations', group: 'Founder', path: '/founder/recommendations', role: 'founder' },
  { label: 'Reports', group: 'Founder', path: '/founder/reports', role: 'founder' },
  { label: 'Investor Sharing', group: 'Founder', path: '/founder/sharing', role: 'founder' },
  { label: 'Workspace Settings', group: 'Founder', path: '/founder/settings', role: 'founder' },
  { label: 'Portfolio Overview', group: 'Investor', path: '/investor/overview', role: 'investor' },
  { label: 'Companies Directory', group: 'Investor', path: '/investor/companies', role: 'investor' },
  { label: 'Financial Performance', group: 'Investor', path: '/investor/performance', role: 'investor' },
  { label: 'Financial Transparency & Provenance', group: 'Investor', path: '/investor/transparency', role: 'investor' },
  { label: 'Investor Reports', group: 'Investor', path: '/investor/reports', role: 'investor' },
  { label: 'Founder Questions (Q&A)', group: 'Investor', path: '/investor/questions', role: 'investor' },
  { label: 'Investment & Dilution Simulator', group: 'Investor', path: '/investor/simulator', role: 'investor' },
  { label: 'Investor Settings', group: 'Investor', path: '/investor/settings', role: 'investor' },
];

export const CommandPalette: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { setRoleMode } = usePlatform();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const filtered = COMMAND_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.group.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/30 px-4 pt-20 backdrop-blur-[1px]">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any Founder or Investor view..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-500">
              No matching pages found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  setRoleMode(item.role);
                  navigate(item.path);
                  onClose();
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                      item.role === 'founder'
                        ? 'bg-brand-50 text-brand-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {item.group}
                  </span>
                  <span className="font-medium text-slate-800">{item.label}</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
