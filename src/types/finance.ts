export type RoleMode = 'founder' | 'investor';

export type ProvenanceType =
  | 'bank_derived'
  | 'accounting_derived'
  | 'founder_entered'
  | 'ai_extracted'
  | 'projected'
  | 'unreconciled';

export type ReconciliationStatus =
  | 'reconciled'
  | 'partial'
  | 'unreconciled'
  | 'ai_review'
  | 'projected';

export interface ProvenanceStep {
  label: string;
  value: string;
  source: string;
  provenance: ProvenanceType;
}

export interface ContributingRecord {
  id: string;
  date: string;
  description: string;
  amount: string;
  source: string;
  status: string;
}

export interface MetricProvenance {
  id: string;
  label: string;
  formattedValue: string;
  rawValue: number;
  sublabel?: string;
  delta?: string;
  deltaPositive?: boolean;
  provenance: ProvenanceType;
  sourceLabel: string;
  formula: string;
  reconciliationStatus: ReconciliationStatus;
  lastSynced: string;
  humanConfirmed: boolean;
  steps: ProvenanceStep[];
  contributingRecords: ContributingRecord[];
}

export interface MonthlyFinancialPoint {
  month: string;
  revenue: number;
  cogs: number;
  opex: number;
  expenses: number;
  netBurn: number;
  cashBalance: number;
  grossMarginPct: number;
  netMarginPct: number;
  inflow: number;
  outflow: number;
  ar: number;
  ap: number;
}

export interface Transaction {
  id: string;
  date: string;
  vendor: string;
  description: string;
  category: string;
  department: 'Engineering' | 'Sales & Marketing' | 'G&A' | 'Infrastructure' | 'Revenue';
  type: 'inflow' | 'outflow';
  amount: number;
  provenance: ProvenanceType;
  reconciliationStatus: 'matched' | 'unmatched' | 'discrepancy' | 'needs_review';
  bankRef?: string;
  ledgerRef?: string;
  aiConfidence?: number;
  humanConfirmed: boolean;
  notes?: string;
}

export interface ReconciliationItem {
  id: string;
  date: string;
  bankDescription: string;
  bankAmount: number;
  bankAccount: string;
  ledgerDescription?: string;
  ledgerAmount?: number;
  ledgerRef?: string;
  status: 'matched' | 'needs_review' | 'unmatched' | 'discrepancy';
  matchScore: number;
  variance: number;
  reason?: string;
}

export interface ExpenseFinding {
  id: string;
  title: string;
  category:
    | 'Duplicate Subscription'
    | 'Rising Vendor Cost'
    | 'Unused Licenses'
    | 'Unnecessary Recurring'
    | 'Operational Inefficiency'
    | 'Legitimate Core Spend';
  classification: 'actionable_waste' | 'needs_review' | 'legitimate_monitored';
  vendor: string;
  currentMonthlySpend: number;
  estimatedMonthlySavings: number;
  annualizedSavings: number;
  whyFlagged: string;
  evidence: string[];
  riskLevel: 'low' | 'medium' | 'high';
  riskExplanation: string;
  suggestedAction: string;
  status: 'open' | 'sent_to_recs' | 'dismissed';
}

export interface Recommendation {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'quick_win';
  problem: string;
  evidence: string;
  monthlySavings: number;
  annualSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskNote: string;
  steps: string[];
  status: 'pending' | 'approved' | 'implemented';
}

export interface InvestorPermissions {
  shareRevenueAndGrowth: boolean;
  shareBurnAndRunway: boolean;
  shareExpenseBreakdown: boolean;
  shareReconciliationDiscrepancies: boolean;
  allowProvenanceDrilldown: boolean;
  allowInvestorQA: boolean;
}

export interface InvestorAccessGrant {
  id: string;
  investorName: string;
  firm: string;
  email: string;
  accessLevel: 'Full Data Room' | 'Performance Only' | 'Observer';
  lastViewed: string;
  status: 'active' | 'revoked';
}

export interface InvestorQuestion {
  id: string;
  companyId: string;
  investorName: string;
  investorFirm: string;
  askedAt: string;
  metricTag?: string;
  question: string;
  status: 'answered' | 'pending';
  answer?: string;
  answeredAt?: string;
}

export interface ConfidenceBreakdownItem {
  label: string;
  score: number;
  maxScore: number;
  description: string;
  provenance: ProvenanceType;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  sector: string;
  stage: string;
  founded: string;
  arr: number;
  mrr: number;
  mrrGrowthMom: number;
  cashBalance: number;
  netBurn: number;
  runwayMonths: number;
  grossMarginPct: number;
  burnMultiple: number;
  confidenceScore: number;
  reconciliationCoveragePct: number;
  unmatchedCount: number;
  investedAmount: number;
  ownershipPct: number;
  currentValuation: number;
  lastUpdated: string;
  healthStatus: 'strong' | 'watch' | 'attention';
  isPrimaryDemo?: boolean;
}

export interface FinancialReportItem {
  id: string;
  title: string;
  type: 'Executive Summary' | 'P&L & Cash Flow' | 'Provenance Audit' | 'Expense Optimization' | 'Board Update';
  period: string;
  generatedAt: string;
  audience: 'Founder & Internal' | 'Investor Shared';
  confidenceScore: number;
  summary: string;
  highlights: string[];
}
