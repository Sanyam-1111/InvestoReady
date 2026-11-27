import React, { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  FileBarChart2,
  FileCheck2,
  GitCompare,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Menu,
  MessageSquareText,
  Receipt,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import { ProvenanceDrawer } from '../shared/ProvenanceDrawer';
import { ToastContainer } from '../shared/ToastContainer';
import { CommandPalette } from './CommandPalette';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
}

export const AppShell: React.FC = () => {
  const {
    roleMode,
    setRoleMode,
    reconciliationItems,
    questions,
    confidenceScore,
    selectedCompany,
  } = usePlatform();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const pendingRecCount = reconciliationItems.filter((r) => r.status !== 'matched').length;
  const pendingQuestionsCount = questions.filter((q) => q.status === 'pending').length;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith('/investor') && roleMode !== 'investor') {
      setRoleMode('investor');
    } else if (location.pathname.startsWith('/founder') && roleMode !== 'founder') {
      setRoleMode('founder');
    }
    setMobileOpen(false);
  }, [location.pathname, roleMode, setRoleMode]);

  const founderNav: NavItem[] = [
    { label: 'Overview', path: '/founder/overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Financial Analytics', path: '/founder/analytics', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Transactions', path: '/founder/transactions', icon: <Receipt className="h-4 w-4" /> },
    {
      label: 'Reconciliation',
      path: '/founder/reconciliation',
      icon: <GitCompare className="h-4 w-4" />,
      badge: pendingRecCount > 0 ? String(pendingRecCount) : undefined,
    },
    { label: 'Expense Optimizer', path: '/founder/optimizer', icon: <Sparkles className="h-4 w-4" />, badge: '$11.1k' },
    { label: 'AI Financial Advisor', path: '/founder/advisor', icon: <MessageSquareText className="h-4 w-4" /> },
    { label: 'Forecasting', path: '/founder/forecasting', icon: <TrendingUp className="h-4 w-4" /> },
    { label: 'Scenario Simulator', path: '/founder/scenarios', icon: <Sliders className="h-4 w-4" /> },
    { label: 'Recommendations', path: '/founder/recommendations', icon: <ListChecks className="h-4 w-4" /> },
    { label: 'Reports', path: '/founder/reports', icon: <FileBarChart2 className="h-4 w-4" /> },
    { label: 'Investor Sharing', path: '/founder/sharing', icon: <Share2 className="h-4 w-4" /> },
    { label: 'Settings', path: '/founder/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const investorNav: NavItem[] = [
    { label: 'Portfolio Overview', path: '/investor/overview', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Companies', path: '/investor/companies', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Financial Performance', path: '/investor/performance', icon: <LineChart className="h-4 w-4" /> },
    {
      label: 'Financial Transparency',
      path: '/investor/transparency',
      icon: <ShieldCheck className="h-4 w-4" />,
      badge: `${confidenceScore}`,
    },
    { label: 'Reports', path: '/investor/reports', icon: <FileCheck2 className="h-4 w-4" /> },
    {
      label: 'Founder Questions',
      path: '/investor/questions',
      icon: <ClipboardCheck className="h-4 w-4" />,
      badge: pendingQuestionsCount > 0 ? String(pendingQuestionsCount) : undefined,
    },
    { label: 'Investment Simulator', path: '/investor/simulator', icon: <Calculator className="h-4 w-4" /> },
    { label: 'Settings', path: '/investor/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const navItems = roleMode === 'founder' ? founderNav : investorNav;

  const switchRole = (target: 'founder' | 'investor') => {
    setRoleMode(target);
    navigate(target === 'founder' ? '/founder/overview' : '/investor/overview');
  };

  const SidebarContent = (
    <div className="flex h-full flex-col bg-white">
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 text-left"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <ShieldCheck className="h-4 w-4 text-brand-200" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-900">Investor-Ready</p>
            <p className="text-[10px] font-medium text-slate-400">
              {roleMode === 'founder' ? 'Business Intelligence' : 'Investor Portal'}
            </p>
          </div>
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role Switcher */}
      <div className="border-b border-slate-100 p-3">
        <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => switchRole('founder')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              roleMode === 'founder'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Founder
          </button>
          <button
            onClick={() => switchRole('investor')}
            className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
              roleMode === 'investor'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Investor
          </button>
        </div>
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-800">
              {roleMode === 'founder' ? 'Meridian Cloud Inc.' : selectedCompany.name}
            </p>
            <p className="text-[10px] text-slate-500">
              Seed · Confidence {confidenceScore}/100
            </p>
          </div>
          <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" title="Live Demo Sync" />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50/90 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums ${
                      isActive
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer tagline */}
      <div className="border-t border-slate-200/80 px-4 py-3">
        <p className="text-[11px] font-medium text-slate-500">
          Know your money. Optimize your business. Earn investor trust.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-canvas text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/90 bg-white lg:block">
        <div className="sticky top-0 h-screen">{SidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-10 w-72 border-r border-slate-200 bg-white shadow-xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs text-slate-500 transition-colors hover:border-slate-300 hover:bg-white sm:w-72"
            >
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <span className="flex-1 text-left">Jump to page or metric...</span>
              <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-400 sm:inline">
                Ctrl K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-2.5 py-1 text-[11px] font-medium text-indigo-700 md:inline-flex">
              <CheckCircle2 className="h-3 w-3" />
              Demo Workspace · Simulated Feeds
            </span>

            <button
              onClick={() => switchRole(roleMode === 'founder' ? 'investor' : 'founder')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-brand-600" />
              <span className="hidden sm:inline">
                Switch to {roleMode === 'founder' ? 'Investor' : 'Founder'}
              </span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-elevated">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold text-slate-900">Platform Alerts</span>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[11px] text-slate-400 hover:text-slate-700"
                    >
                      Close
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    <div className="rounded-lg bg-amber-50/70 p-2.5 text-amber-900">
                      <p className="font-medium">1 AI-Extracted PDF Needs Review</p>
                      <p className="mt-0.5 text-[11px] text-amber-700">
                        Vanguard Legal LLP ($6,400) awaiting human confirmation.
                      </p>
                    </div>
                    <div className="rounded-lg bg-rose-50/70 p-2.5 text-rose-900">
                      <p className="font-medium">Datadog Variance Detected ($720)</p>
                      <p className="mt-0.5 text-[11px] text-rose-700">
                        Nov card charge exceeds QuickBooks PO baseline.
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-50/70 p-2.5 text-emerald-900">
                      <p className="font-medium">$11,080/mo Savings Identified</p>
                      <p className="mt-0.5 text-[11px] text-emerald-700">
                        4 actionable items ready in Expense Optimizer.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <ProvenanceDrawer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
};
