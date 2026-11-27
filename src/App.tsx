import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { PlatformProvider } from './context/PlatformContext';
import { LandingPage } from './pages/LandingPage';
import { AdvisorPage } from './pages/founder/AdvisorPage';
import { AnalyticsPage } from './pages/founder/AnalyticsPage';
import { ExpenseOptimizerPage } from './pages/founder/ExpenseOptimizerPage';
import { ForecastingPage } from './pages/founder/ForecastingPage';
import { InvestorSharingPage } from './pages/founder/InvestorSharingPage';
import { OverviewPage } from './pages/founder/OverviewPage';
import { RecommendationsPage } from './pages/founder/RecommendationsPage';
import { ReconciliationPage } from './pages/founder/ReconciliationPage';
import { ReportsPage } from './pages/founder/ReportsPage';
import { ScenarioSimulatorPage } from './pages/founder/ScenarioSimulatorPage';
import { SettingsPage } from './pages/founder/SettingsPage';
import { TransactionsPage } from './pages/founder/TransactionsPage';
import { CompaniesPage } from './pages/investor/CompaniesPage';
import { FinancialPerformancePage } from './pages/investor/FinancialPerformancePage';
import { FinancialTransparencyPage } from './pages/investor/FinancialTransparencyPage';
import { FounderQuestionsPage } from './pages/investor/FounderQuestionsPage';
import { InvestmentSimulatorPage } from './pages/investor/InvestmentSimulatorPage';
import { InvestorReportsPage } from './pages/investor/InvestorReportsPage';
import { InvestorSettingsPage } from './pages/investor/InvestorSettingsPage';
import { PortfolioOverviewPage } from './pages/investor/PortfolioOverviewPage';

export function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route path="/founder" element={<AppShell />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="reconciliation" element={<ReconciliationPage />} />
            <Route path="optimizer" element={<ExpenseOptimizerPage />} />
            <Route path="advisor" element={<AdvisorPage />} />
            <Route path="forecasting" element={<ForecastingPage />} />
            <Route path="scenarios" element={<ScenarioSimulatorPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="sharing" element={<InvestorSharingPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/investor" element={<AppShell />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<PortfolioOverviewPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="performance" element={<FinancialPerformancePage />} />
            <Route path="transparency" element={<FinancialTransparencyPage />} />
            <Route path="reports" element={<InvestorReportsPage />} />
            <Route path="questions" element={<FounderQuestionsPage />} />
            <Route path="simulator" element={<InvestmentSimulatorPage />} />
            <Route path="settings" element={<InvestorSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}

export default App;
