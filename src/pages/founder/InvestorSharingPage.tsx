import React, { useState } from 'react';
import { Eye, MessageSquare, Plus, Send, Shield, UserCheck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../components/shared/PageHeader';
import { usePlatform } from '../../context/PlatformContext';
import { InvestorAccessGrant, InvestorPermissions } from '../../types/finance';

const PERMISSION_ITEMS: { key: keyof InvestorPermissions; label: string; desc: string }[] = [
  {
    key: 'shareRevenueAndGrowth',
    label: 'Share Revenue & Growth Metrics',
    desc: 'Allows investors to view MRR, ARR, and historical revenue growth charts.',
  },
  {
    key: 'shareBurnAndRunway',
    label: 'Share Cash, Burn & Runway',
    desc: 'Exposes live Mercury cash balance, monthly net burn, and runway projections.',
  },
  {
    key: 'shareExpenseBreakdown',
    label: 'Share Detailed Expense Breakdown',
    desc: 'Grants visibility into department spending, COGS, and vendor breakdowns.',
  },
  {
    key: 'shareReconciliationDiscrepancies',
    label: 'Share Reconciliation & Unmatched Items',
    desc: 'Lets investors inspect unmatched bank deposits and ledger discrepancies.',
  },
  {
    key: 'allowProvenanceDrilldown',
    label: 'Allow Metric Provenance Drill-Down',
    desc: 'Enables clicking any KPI to inspect calculation formulas and source records.',
  },
  {
    key: 'allowInvestorQA',
    label: 'Enable Investor Questions Thread',
    desc: 'Allows invited investors to submit metric-tagged questions to the founder.',
  },
];

export const InvestorSharingPage: React.FC = () => {
  const {
    permissions,
    togglePermission,
    grants,
    addInvestorGrant,
    revokeInvestorGrant,
    questions,
    answerQuestion,
    setRoleMode,
  } = usePlatform();
  const navigate = useNavigate();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [firm, setFirm] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState<InvestorAccessGrant['accessLevel']>('Full Data Room');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !firm.trim() || !email.trim()) return;
    addInvestorGrant({ investorName: name.trim(), firm: firm.trim(), email: email.trim(), accessLevel });
    setName('');
    setFirm('');
    setEmail('');
    setInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investor Data Sharing & Governance"
        subtitle="Control exactly which financial metrics, provenance traces, and discrepancy logs investors can access."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRoleMode('investor');
                navigate('/investor/performance');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview as Investor</span>
            </button>
            <button
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-brand-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Invite Investor</span>
            </button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Permission Matrix */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Shield className="h-4 w-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Granular Data Room Permissions</h2>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {PERMISSION_ITEMS.map((item) => {
              const enabled = permissions[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-900">{item.label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePermission(item.key)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                      enabled ? 'bg-brand-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        enabled ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Investor Access List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-slate-900">Authorized Investors</h2>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {grants.map((grant) => (
              <div key={grant.id} className="flex items-center justify-between gap-3 py-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-900">
                    {grant.investorName} · <span className="text-slate-600">{grant.firm}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {grant.email} · {grant.accessLevel} · Viewed {grant.lastViewed}
                  </p>
                </div>
                <button
                  onClick={() => revokeInvestorGrant(grant.id)}
                  className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                    grant.status === 'active'
                      ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {grant.status === 'active' ? 'Revoke' : 'Restore'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Founder Q&A Inbox */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <MessageSquare className="h-4 w-4 text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-900">Investor Questions Inbox</h2>
        </div>
        <div className="mt-4 space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">
                  {q.investorName} ({q.investorFirm})
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    q.status === 'answered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {q.status}
                </span>
              </div>
              {q.metricTag && (
                <p className="mt-1 font-mono text-[11px] text-brand-700">Ref: {q.metricTag}</p>
              )}
              <p className="mt-2 text-slate-800">{q.question}</p>
              {q.answer ? (
                <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3 text-slate-700">
                  <p className="font-semibold text-emerald-800">Founder Response ({q.answeredAt}):</p>
                  <p className="mt-1">{q.answer}</p>
                </div>
              ) : (
                <div className="mt-3 flex gap-2">
                  <input
                    value={replyDrafts[q.id] || ''}
                    onChange={(e) =>
                      setReplyDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Write a transparent response backed by your ledger..."
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={() => {
                      const txt = (replyDrafts[q.id] || '').trim();
                      if (!txt) return;
                      answerQuestion(q.id, txt);
                      setReplyDrafts((prev) => ({ ...prev, [q.id]: '' }));
                    }}
                    className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-2 font-medium text-white hover:bg-brand-700"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Publish</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="fixed inset-0" onClick={() => setInviteOpen(false)} />
          <form
            onSubmit={handleInvite}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Invite Investor to Data Room</h3>
              <button type="button" onClick={() => setInviteOpen(false)} className="text-slate-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="font-medium text-slate-700">Investor Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Firm / Syndicate</label>
                <input
                  required
                  value={firm}
                  onChange={(e) => setFirm(e.target.value)}
                  placeholder="Summit Peak Ventures"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@summitpeak.vc"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Access Tier</label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as InvestorAccessGrant['accessLevel'])}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none"
                >
                  <option value="Full Data Room">Full Data Room</option>
                  <option value="Performance Only">Performance Only</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
