import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { ProvenanceBadge } from '../../components/shared/ProvenanceBadge';
import { usePlatform } from '../../context/PlatformContext';
import { ProvenanceType, Transaction } from '../../types/finance';
import { formatCurrency } from '../../utils/formatters';

export const TransactionsPage: React.FC = () => {
  const { transactions, confirmTransaction, addTransaction } = usePlatform();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [provenanceFilter, setProvenanceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [newVendor, setNewVendor] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Software & SaaS');
  const [newType, setNewType] = useState<'inflow' | 'outflow'>('outflow');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(transactions.map((t) => t.category)))],
    [transactions]
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => {
        const q = search.toLowerCase();
        const matchesQuery =
          t.vendor.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q);
        const matchesCat = categoryFilter === 'All' || t.category === categoryFilter;
        const matchesProv = provenanceFilter === 'All' || t.provenance === provenanceFilter;
        const matchesStatus = statusFilter === 'All' || t.reconciliationStatus === statusFilter;
        return matchesQuery && matchesCat && matchesProv && matchesStatus;
      })
      .sort((a, b) => {
        const factor = sortDir === 'asc' ? 1 : -1;
        if (sortBy === 'amount') return (a.amount - b.amount) * factor;
        return a.date.localeCompare(b.date) * factor;
      });
  }, [transactions, search, categoryFilter, provenanceFilter, statusFilter, sortBy, sortDir]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalInflows = filtered
    .filter((t) => t.type === 'inflow')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalOutflows = filtered
    .filter((t) => t.type === 'outflow')
    .reduce((acc, t) => acc + t.amount, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(newAmount);
    if (!newVendor.trim() || !num || num <= 0) return;
    addTransaction({
      date: '2026-11-27',
      vendor: newVendor.trim(),
      description: newDesc.trim() || 'Manual founder entry',
      category: newCategory,
      department: newType === 'inflow' ? 'Revenue' : 'G&A',
      type: newType,
      amount: num,
      provenance: 'founder_entered',
      reconciliationStatus: 'needs_review',
      humanConfirmed: true,
    });
    setNewVendor('');
    setNewDesc('');
    setNewAmount('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transactions Ledger"
        subtitle="Inspect bank feeds, accounting entries, and AI-extracted invoices with full source labels."
        actions={
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-brand-700"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Manual Entry</span>
          </button>
        }
      />

      {/* Summary Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Filtered Inflows</p>
          <p className="mt-1 font-mono text-xl font-semibold text-emerald-600 tabular-nums">
            +{formatCurrency(totalInflows)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">Filtered Outflows</p>
          <p className="mt-1 font-mono text-xl font-semibold text-slate-900 tabular-nums">
            -{formatCurrency(totalOutflows)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
          <p className="text-xs text-slate-500">AI Extractions Pending Review</p>
          <p className="mt-1 font-mono text-xl font-semibold text-amber-600 tabular-nums">
            {transactions.filter((t) => t.provenance === 'ai_extracted' && !t.humanConfirmed).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search vendor, description, or ID..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-2 pl-9 pr-3 text-xs text-slate-900 outline-none focus:border-brand-500 focus:bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              Category: {c}
            </option>
          ))}
        </select>
        <select
          value={provenanceFilter}
          onChange={(e) => {
            setProvenanceFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
        >
          <option value="All">Source: All</option>
          {(['bank_derived', 'accounting_derived', 'founder_entered', 'ai_extracted', 'unreconciled'] as ProvenanceType[]).map(
            (p) => (
              <option key={p} value={p}>
                {p}
              </option>
            )
          )}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none"
        >
          <option value="All">Status: All</option>
          <option value="matched">Matched</option>
          <option value="needs_review">Needs Review</option>
          <option value="unmatched">Unmatched</option>
          <option value="discrepancy">Discrepancy</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th
                  onClick={() => {
                    setSortBy('date');
                    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                  }}
                  className="cursor-pointer px-4 py-3 hover:text-slate-800"
                >
                  Date {sortBy === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-4 py-3">Vendor &amp; Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Provenance Source</th>
                <th className="px-4 py-3">Status</th>
                <th
                  onClick={() => {
                    setSortBy('amount');
                    setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                  }}
                  className="cursor-pointer px-4 py-3 text-right hover:text-slate-800"
                >
                  Amount {sortBy === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    No transactions match the current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="cursor-pointer transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-slate-500">{tx.date}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{tx.vendor}</p>
                      <p className="max-w-xs truncate text-slate-500">{tx.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{tx.category}</td>
                    <td className="px-4 py-3">
                      <ProvenanceBadge type={tx.provenance} compact />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                          tx.reconciliationStatus === 'matched'
                            ? 'bg-emerald-50 text-emerald-700'
                            : tx.reconciliationStatus === 'discrepancy'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {tx.reconciliationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-mono font-semibold tabular-nums ${
                        tx.type === 'inflow' ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'inflow' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-slate-200 p-1 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-slate-200 p-1 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details Drawer */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25">
          <div className="fixed inset-0" onClick={() => setSelectedTx(null)} />
          <aside className="animate-drawer-in relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <p className="font-mono text-xs text-slate-400">{selectedTx.id}</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedTx.vendor}</h3>
                <p className="text-xs text-slate-500">{selectedTx.description}</p>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-slate-500">Amount</p>
                <p className="mt-1 font-mono text-2xl font-semibold text-slate-900 tabular-nums">
                  {selectedTx.type === 'inflow' ? '+' : '-'}
                  {formatCurrency(selectedTx.amount)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <ProvenanceBadge type={selectedTx.provenance} />
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 p-4">
                <div>
                  <dt className="text-slate-400">Date</dt>
                  <dd className="mt-0.5 font-mono font-medium text-slate-900">{selectedTx.date}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Department</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{selectedTx.department}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Bank Reference</dt>
                  <dd className="mt-0.5 font-mono text-slate-800">{selectedTx.bankRef || '—'}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Ledger Reference</dt>
                  <dd className="mt-0.5 font-mono text-slate-800">{selectedTx.ledgerRef || '—'}</dd>
                </div>
              </dl>

              {selectedTx.notes && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-slate-700">
                  <p className="font-semibold text-slate-900">Audit &amp; Context Notes</p>
                  <p className="mt-1">{selectedTx.notes}</p>
                </div>
              )}

              {selectedTx.provenance === 'ai_extracted' && !selectedTx.humanConfirmed && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 font-semibold text-amber-900">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>AI Extraction ({Math.round((selectedTx.aiConfidence || 0.9) * 100)}% confidence)</span>
                  </div>
                  <p className="mt-1 text-amber-800">
                    Per provenance rules, AI-extracted entries remain flagged until a human confirms
                    the vendor, category, and amount.
                  </p>
                  <button
                    onClick={() => {
                      confirmTransaction(selectedTx.id);
                      setSelectedTx({
                        ...selectedTx,
                        humanConfirmed: true,
                        provenance: 'accounting_derived',
                        reconciliationStatus: 'matched',
                      });
                    }}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 font-medium text-white hover:bg-amber-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Confirm &amp; Promote to Ledger</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Add Manual Entry Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 px-4">
          <div className="fixed inset-0" onClick={() => setAddOpen(false)} />
          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Add Founder Entry</h3>
              <button type="button" onClick={() => setAddOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              New entries are tagged as <code className="font-mono">founder_entered</code> until matched.
            </p>
            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700">Vendor / Counterparty</label>
                <input
                  required
                  value={newVendor}
                  onChange={(e) => setNewVendor(e.target.value)}
                  placeholder="e.g. Linear Orbit Inc."
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'inflow' | 'outflow')}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none"
                  >
                    <option value="outflow">Outflow (Expense)</option>
                    <option value="inflow">Inflow (Revenue)</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700">Amount (USD)</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="2500"
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="font-medium text-slate-700">Category</label>
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700">Description</label>
                <input
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Monthly subscription or invoice memo"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-medium text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-4 py-2 text-xs font-medium text-white hover:bg-brand-700"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
