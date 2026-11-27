import React from 'react';
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  GitMerge,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../context/PlatformContext';
import { ProvenanceBadge } from '../components/shared/ProvenanceBadge';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setRoleMode, confidenceScore, reconciliationCoveragePct } = usePlatform();

  const enterExperience = (role: 'founder' | 'investor') => {
    setRoleMode(role);
    navigate(role === 'founder' ? '/founder/overview' : '/investor/overview');
  };

  return (
    <div className="min-h-screen bg-surface-canvas text-slate-900">
      {/* Top Nav */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldCheck className="h-4 w-4 text-brand-200" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Investor-Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => enterExperience('founder')}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              Founder App
            </button>
            <button
              onClick={() => enterExperience('investor')}
              className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
            >
              Investor Portal
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Stage 1 Workspace · Meridian Cloud Inc. Seed Demo</span>
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Know your money. Optimize your business. Earn investor trust.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            One connected financial intelligence platform uniting founder cash optimization with
            metric-level investor transparency. Every number carries explicit source provenance.
          </p>
        </div>

        {/* Two Experience Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-brand-300 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                  12 Modules
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                Business Financial Intelligence
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Built for founders and finance leads to monitor burn, reconcile bank and ledger
                feeds, isolate wasteful SaaS/cloud spend, and forecast runway scenarios.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>$11,080/mo savings identified with waste vs. core spend separation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Bank-to-ledger reconciliation ({reconciliationCoveragePct}% coverage)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Granular founder-controlled investor sharing permissions</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => enterExperience('founder')}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
            >
              <span>Enter Founder Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all hover:border-emerald-300 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600">
                  8 Modules
                </span>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                Investor Intelligence Portal
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Built for VCs and angels to track portfolio health, inspect financial confidence
                scores, trace metrics to underlying feeds, and model dilution.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Dynamic Financial Confidence Score ({confidenceScore}/100)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Click-to-trace provenance &amp; unmatched transaction visibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Founder Q&amp;A threads + interactive equity &amp; dilution simulator</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => enterExperience('investor')}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <span>Enter Investor Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Provenance Differentiator Strip */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5">
              <GitMerge className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Metric-Level Provenance Taxonomy Across Every Screen
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Source-linked transparency · Not an independent audit
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ProvenanceBadge type="bank_derived" />
            <ProvenanceBadge type="accounting_derived" />
            <ProvenanceBadge type="founder_entered" />
            <ProvenanceBadge type="ai_extracted" />
            <ProvenanceBadge type="projected" />
            <ProvenanceBadge type="unreconciled" />
          </div>
        </div>
      </main>
    </div>
  );
};
