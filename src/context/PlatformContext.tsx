import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  CORE_METRICS,
  DEFAULT_INVESTOR_PERMISSIONS,
  INITIAL_EXPENSE_FINDINGS,
  INITIAL_INVESTOR_GRANTS,
  INITIAL_QUESTIONS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_RECONCILIATION_ITEMS,
  INITIAL_REPORTS,
  INITIAL_TRANSACTIONS,
  MONTHLY_FINANCIALS,
  PORTFOLIO_COMPANIES,
} from '../data/mockFinancialData';
import {
  ExpenseFinding,
  FinancialReportItem,
  InvestorAccessGrant,
  InvestorPermissions,
  InvestorQuestion,
  MetricProvenance,
  PortfolioCompany,
  Recommendation,
  ReconciliationItem,
  RoleMode,
  Transaction,
} from '../types/finance';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: 'success' | 'info' | 'warning';
}

interface PlatformContextValue {
  roleMode: RoleMode;
  setRoleMode: (role: RoleMode) => void;
  activeTraceMetric: MetricProvenance | null;
  openTraceMetric: (metricOrId: MetricProvenance | string) => void;
  closeTraceMetric: () => void;
  transactions: Transaction[];
  confirmTransaction: (id: string) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  reconciliationItems: ReconciliationItem[];
  updateReconciliationStatus: (id: string, status: ReconciliationItem['status']) => void;
  findings: ExpenseFinding[];
  sendFindingToRecommendations: (id: string) => void;
  dismissFinding: (id: string) => void;
  recommendations: Recommendation[];
  updateRecommendationStatus: (id: string, status: Recommendation['status']) => void;
  permissions: InvestorPermissions;
  togglePermission: (key: keyof InvestorPermissions) => void;
  grants: InvestorAccessGrant[];
  addInvestorGrant: (grant: Omit<InvestorAccessGrant, 'id' | 'lastViewed' | 'status'>) => void;
  revokeInvestorGrant: (id: string) => void;
  questions: InvestorQuestion[];
  askQuestion: (question: string, metricTag?: string) => void;
  answerQuestion: (id: string, answer: string) => void;
  reports: FinancialReportItem[];
  addReport: (report: Omit<FinancialReportItem, 'id' | 'generatedAt'>) => void;
  portfolioCompanies: PortfolioCompany[];
  selectedCompanyId: string;
  setSelectedCompanyId: (id: string) => void;
  selectedCompany: PortfolioCompany;
  confidenceScore: number;
  reconciliationCoveragePct: number;
  toasts: ToastMessage[];
  notify: (title: string, description?: string, variant?: ToastMessage['variant']) => void;
  dismissToast: (id: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roleMode, setRoleMode] = useState<RoleMode>('founder');
  const [activeTraceMetric, setActiveTraceMetric] = useState<MetricProvenance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [reconciliationItems, setReconciliationItems] = useState<ReconciliationItem[]>(
    INITIAL_RECONCILIATION_ITEMS
  );
  const [findings, setFindings] = useState<ExpenseFinding[]>(INITIAL_EXPENSE_FINDINGS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [permissions, setPermissions] = useState<InvestorPermissions>(DEFAULT_INVESTOR_PERMISSIONS);
  const [grants, setGrants] = useState<InvestorAccessGrant[]>(INITIAL_INVESTOR_GRANTS);
  const [questions, setQuestions] = useState<InvestorQuestion[]>(INITIAL_QUESTIONS);
  const [reports, setReports] = useState<FinancialReportItem[]>(INITIAL_REPORTS);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('meridian-cloud');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = (
    title: string,
    description?: string,
    variant: ToastMessage['variant'] = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openTraceMetric = (metricOrId: MetricProvenance | string) => {
    if (typeof metricOrId === 'string') {
      const found = CORE_METRICS[metricOrId];
      if (found) setActiveTraceMetric(found);
      return;
    }
    setActiveTraceMetric(metricOrId);
  };

  const closeTraceMetric = () => setActiveTraceMetric(null);

  const confirmTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === id
          ? {
              ...tx,
              humanConfirmed: true,
              reconciliationStatus: tx.reconciliationStatus === 'needs_review' ? 'matched' : tx.reconciliationStatus,
              provenance: tx.provenance === 'ai_extracted' ? 'accounting_derived' : tx.provenance,
            }
          : tx
      )
    );
    notify('AI extraction confirmed', 'Transaction verified and promoted to accounting-derived ledger.');
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `TXN-2611-${String(transactions.length + 1).padStart(2, '0')}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    notify('Transaction added', `${tx.vendor} (${tx.type === 'inflow' ? '+' : '-'}$${tx.amount.toLocaleString()})`);
  };

  const updateReconciliationStatus = (id: string, status: ReconciliationItem['status']) => {
    setReconciliationItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              matchScore: status === 'matched' ? 100 : item.matchScore,
              variance: status === 'matched' ? 0 : item.variance,
            }
          : item
      )
    );
    notify(
      status === 'matched' ? 'Match confirmed' : 'Item flagged for review',
      `Reconciliation record ${id} updated to ${status.replace('_', ' ')}.`,
      status === 'discrepancy' ? 'warning' : 'success'
    );
  };

  const sendFindingToRecommendations = (id: string) => {
    const target = findings.find((f) => f.id === id);
    if (!target) return;
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'sent_to_recs' } : f))
    );
    const exists = recommendations.some((r) => r.title.includes(target.vendor));
    if (!exists) {
      setRecommendations((prev) => [
        {
          id: `REC-ACT-${String(prev.length + 1).padStart(2, '0')}`,
          title: target.title,
          category: target.category,
          priority: target.estimatedMonthlySavings >= 2500 ? 'high' : 'quick_win',
          problem: target.whyFlagged,
          evidence: target.evidence.join(' '),
          monthlySavings: target.estimatedMonthlySavings,
          annualSavings: target.annualizedSavings,
          riskLevel: target.riskLevel,
          riskNote: target.riskExplanation,
          steps: [target.suggestedAction, 'Monitor next billing cycle invoice for confirmation.'],
          status: 'pending',
        },
        ...prev,
      ]);
    }
    notify('Added to Recommendations', `${target.vendor} action plan queued for execution.`);
  };

  const dismissFinding = (id: string) => {
    setFindings((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'dismissed' } : f)));
    notify('Finding dismissed', 'Marked as acceptable operating spend.', 'info');
  };

  const updateRecommendationStatus = (id: string, status: Recommendation['status']) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec))
    );
    notify('Recommendation updated', `Status changed to ${status}.`);
  };

  const togglePermission = (key: keyof InvestorPermissions) => {
    setPermissions((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      notify(
        'Investor access updated',
        `Permission "${key.replace(/([A-Z])/g, ' $1').trim()}" is now ${next[key] ? 'enabled' : 'restricted'}.`,
        'info'
      );
      return next;
    });
  };

  const addInvestorGrant = (grant: Omit<InvestorAccessGrant, 'id' | 'lastViewed' | 'status'>) => {
    setGrants((prev) => [
      {
        ...grant,
        id: `GRANT-${String(prev.length + 1).padStart(2, '0')}`,
        lastViewed: 'Invited just now',
        status: 'active',
      },
      ...prev,
    ]);
    notify('Investor invited', `Access granted to ${grant.investorName} (${grant.firm}).`);
  };

  const revokeInvestorGrant = (id: string) => {
    setGrants((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: g.status === 'active' ? 'revoked' : 'active' } : g))
    );
    notify('Investor access changed', 'Investor portal access state updated.', 'info');
  };

  const askQuestion = (question: string, metricTag?: string) => {
    const newQ: InvestorQuestion = {
      id: `Q-${101 + questions.length}`,
      companyId: selectedCompanyId,
      investorName: 'Elena Rostova',
      investorFirm: 'Horizon Ventures',
      askedAt: '2026-11-27',
      metricTag,
      question,
      status: 'pending',
    };
    setQuestions((prev) => [newQ, ...prev]);
    notify('Question sent to Founder', 'Meridian Cloud founder will be notified to respond.');
  };

  const answerQuestion = (id: string, answer: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: 'answered', answer, answeredAt: '2026-11-27' }
          : q
      )
    );
    notify('Response published', 'Your answer is now visible in the Investor Portal Q&A.');
  };

  const addReport = (report: Omit<FinancialReportItem, 'id' | 'generatedAt'>) => {
    setReports((prev) => [
      {
        ...report,
        id: `REP-2026-${prev.length + 12}`,
        generatedAt: 'Just now',
      },
      ...prev,
    ]);
    notify('Report generated', `${report.title} is ready to preview or download.`);
  };

  const reconciliationCoveragePct = useMemo(() => {
    const matched = reconciliationItems.filter((r) => r.status === 'matched').length;
    const baseMatched = 39 + matched;
    const total = 43 + reconciliationItems.length;
    return Number(((baseMatched / total) * 100).toFixed(1));
  }, [reconciliationItems]);

  const confidenceScore = useMemo(() => {
    const matchedCount = reconciliationItems.filter((r) => r.status === 'matched').length;
    const unconfirmedAi = transactions.filter((t) => t.provenance === 'ai_extracted' && !t.humanConfirmed).length;
    const base = 84 + Math.min(8, matchedCount) - unconfirmedAi * 2;
    return Math.max(55, Math.min(99, base));
  }, [reconciliationItems, transactions]);

  const portfolioCompanies = useMemo(
    () =>
      PORTFOLIO_COMPANIES.map((c) =>
        c.id === 'meridian-cloud'
          ? {
              ...c,
              confidenceScore,
              reconciliationCoveragePct,
              unmatchedCount: reconciliationItems.filter((r) => r.status !== 'matched').length,
            }
          : c
      ),
    [confidenceScore, reconciliationCoveragePct, reconciliationItems]
  );

  const selectedCompany = useMemo(
    () => portfolioCompanies.find((c) => c.id === selectedCompanyId) || portfolioCompanies[0],
    [portfolioCompanies, selectedCompanyId]
  );

  return (
    <PlatformContext.Provider
      value={{
        roleMode,
        setRoleMode,
        activeTraceMetric,
        openTraceMetric,
        closeTraceMetric,
        transactions,
        confirmTransaction,
        addTransaction,
        reconciliationItems,
        updateReconciliationStatus,
        findings,
        sendFindingToRecommendations,
        dismissFinding,
        recommendations,
        updateRecommendationStatus,
        permissions,
        togglePermission,
        grants,
        addInvestorGrant,
        revokeInvestorGrant,
        questions,
        askQuestion,
        answerQuestion,
        reports,
        addReport,
        portfolioCompanies,
        selectedCompanyId,
        setSelectedCompanyId,
        selectedCompany,
        confidenceScore,
        reconciliationCoveragePct,
        toasts,
        notify,
        dismissToast,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
};

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}

export { MONTHLY_FINANCIALS, CORE_METRICS };
