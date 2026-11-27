import React, { useState } from 'react';
import { MessageSquarePlus, Send } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { RestrictedAccessCard } from '../../components/shared/RestrictedAccessCard';
import { usePlatform } from '../../context/PlatformContext';

export const FounderQuestionsPage: React.FC = () => {
  const { questions, askQuestion, permissions, selectedCompany } = usePlatform();
  const [questionText, setQuestionText] = useState('');
  const [metricTag, setMetricTag] = useState('Cash Runway (20.8 mos)');

  if (!permissions.allowInvestorQA) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Founder Questions & Diligence"
          subtitle="Direct metric-linked Q&A between investors and company leadership."
        />
        <RestrictedAccessCard
          sectionName="Investor Questions Thread"
          permissionLabel="Enable Investor Questions Thread"
        />
      </div>
    );
  }

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    askQuestion(questionText.trim(), metricTag);
    setQuestionText('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Founder Questions & Diligence"
        subtitle={`Ask metric-linked diligence questions directly to ${selectedCompany.name}.`}
      />

      {/* Ask Form */}
      <form
        onSubmit={handleAsk}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <MessageSquarePlus className="h-4 w-4 text-brand-600" />
          <span>Submit a New Question</span>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <label className="font-medium text-slate-700">Linked Metric / Topic</label>
            <select
              value={metricTag}
              onChange={(e) => setMetricTag(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none"
            >
              <option>Cash Runway (20.8 mos)</option>
              <option>Gross Margin (79.0%)</option>
              <option>Reconciliation · $14,200 Unmatched Stripe Deposit</option>
              <option>AI-Extracted Legal Invoice ($6,400)</option>
              <option>Burn Multiple (1.34x)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="font-medium text-slate-700">Your Question</label>
            <div className="mt-1 flex gap-2">
              <input
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Ask about unit economics, variance items, or hiring plans..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Q&A List */}
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-slate-900">
                {q.investorName} · <span className="text-slate-500">{q.investorFirm}</span>
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${
                  q.status === 'answered'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {q.status}
              </span>
            </div>
            {q.metricTag && (
              <p className="mt-1 font-mono text-[11px] text-brand-700">Metric Ref: {q.metricTag}</p>
            )}
            <p className="mt-2 text-sm text-slate-800">{q.question}</p>

            {q.answer ? (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5 text-slate-800">
                <p className="font-semibold text-emerald-900">
                  Founder Response · {q.answeredAt}
                </p>
                <p className="mt-1 leading-relaxed">{q.answer}</p>
              </div>
            ) : (
              <p className="mt-3 text-[11px] italic text-slate-400">
                Awaiting founder response (reply directly in Founder → Investor Sharing inbox).
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
