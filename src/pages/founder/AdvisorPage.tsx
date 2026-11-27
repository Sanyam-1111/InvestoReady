import React, { useState } from 'react';
import { Send, Sparkles, TrendingDown, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { usePlatform } from '../../context/PlatformContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
}

const SUGGESTED_PROMPTS = [
  'Why did gross margin dip to 75.6% in October before recovering?',
  'Which expenses can we cut without hurting growth?',
  'What happens to our runway if we hire 2 engineers in Q1?',
  'Explain our current financial confidence score of 88/100.',
];

function generateDemoReply(prompt: string, confidenceScore: number): { content: string; citations: string[] } {
  const q = prompt.toLowerCase();
  if (q.includes('margin') || q.includes('october')) {
    return {
      content:
        'October gross margin dipped 3.1 percentage points (78.7% → 75.6%) because COGS temporarily rose from $29.4k to $34.8k. Specifically, AWS incurred a $4,800 multi-region staging migration while Datadog ingestion spiked +41% from unindexed staging debug logs. In November, COGS normalized to $31.2k, restoring Gross Margin to 79.0%.',
      citations: ['QuickBooks GL 5100', 'Ramp Card RAMP-44120', 'Nov P&L Close'],
    };
  }
  if (q.includes('cut') || q.includes('expense') || q.includes('waste')) {
    return {
      content:
        'You have $11,080/mo ($132,960/yr) in high-confidence savings without touching payroll or core product infrastructure: (1) Cancel overlapping ZoomInfo ($2,650/mo) and standardize on Apollo.io; (2) Filter Datadog staging debug logs ($2,150/mo); (3) Reclaim 11 dormant Figma/HubSpot/Notion seats ($1,480/mo); and (4) Commit a 1-Year AWS Savings Plan ($4,800/mo).',
      citations: ['Expense Optimizer Findings', 'Ramp SaaS Audit'],
    };
  }
  if (q.includes('hire') || q.includes('runway') || q.includes('engineer')) {
    return {
      content:
        'Adding 2 senior engineers (~$28,000/mo loaded payroll) increases monthly net burn from $88,400 to $116,400, reducing zero-growth runway from 20.8 months to 15.8 months. However, executing the $11,080/mo optimizer savings offsets nearly 40% of that cost, keeping runway at 17.5 months.',
      citations: ['Mercury Cash ($1.84M)', 'Gusto Payroll Run Rate'],
    };
  }
  return {
    content: `Meridian Cloud currently holds a ${confidenceScore}/100 Financial Confidence Score. 91.4% of November bank activity is matched to QuickBooks, with two items keeping the score below 95: an unmatched $14,200 Stripe settlement from Nov 25 and one AI-extracted Vanguard Legal invoice ($6,400) awaiting human confirmation.`,
    citations: ['Confidence Engine', 'Reconciliation Queue'],
  };
}

export const AdvisorPage: React.FC = () => {
  const { confidenceScore, openTraceMetric } = usePlatform();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hello! I am monitoring Meridian Cloud’s synced Mercury, Stripe, Ramp, and QuickBooks metrics. Right now, your cash balance is $1,842,400 (20.8 months runway), monthly net burn is $88,400, and $11,080/mo in non-core spend can be reclaimed. What would you like to examine?',
      citations: ['Cash Balance ($1.84M)', 'Net Burn ($88.4k)', 'Optimizer ($11.1k/mo)'],
    },
  ]);

  const sendPrompt = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = generateDemoReply(trimmed, confidenceScore);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', content: trimmed },
      {
        id: `a-${Date.now() + 1}`,
        role: 'assistant',
        content: reply.content,
        citations: reply.citations,
      },
    ]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Financial Advisor"
        subtitle="Contextual executive analysis grounded in your company's provenance-tracked metrics."
        badge="Demo AI Mode · Simulated Reasoning"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Context Column */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Attached Live Context
              </h3>
              <ProvenanceBadge type="bank_derived" compact />
            </div>
            <div className="mt-3 space-y-2.5 text-xs">
              <button
                onClick={() => openTraceMetric('cash_balance')}
                className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100"
              >
                <span className="text-slate-600">Cash Balance</span>
                <span className="font-mono font-semibold text-slate-900">$1,842,400</span>
              </button>
              <button
                onClick={() => openTraceMetric('net_burn')}
                className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100"
              >
                <span className="text-slate-600">Net Burn</span>
                <span className="font-mono font-semibold text-slate-900">$88,400/mo</span>
              </button>
              <button
                onClick={() => openTraceMetric('gross_margin')}
                className="flex w-full items-center justify-between rounded-lg bg-slate-50 px-3 py-2 hover:bg-slate-100"
              >
                <span className="text-slate-600">Gross Margin</span>
                <span className="font-mono font-semibold text-slate-900">79.0%</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Suggested Prompts
            </h3>
            <div className="mt-3 space-y-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendPrompt(p)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 text-left text-xs text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50/40"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p>
              Stage 1 runs in Demo AI Mode using structured context responses. Server-side Gemini /
              Anthropic API wiring connects in Stage 2.
            </p>
          </div>
        </div>

        {/* Chat Workspace */}
        <div className="flex h-[600px] flex-col rounded-2xl border border-slate-200 bg-white shadow-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-semibold text-slate-900">
                Meridian Cloud Financial Copilot
              </span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <TrendingDown className="h-3 w-3" />
               Burn 1.34x
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-800'
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.citations && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.citations.map((c) => (
                        <span
                          key={c}
                          className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600"
                        >
                          Source: {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrompt(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about burn spikes, vendor risks, margins, or hiring impact..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-brand-700"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
