
import { useState } from "react";
import {
  Search,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Pencil,
  Trash2,
  Wallet,
  X,
  AlertTriangle,
} from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Salary",
  "Freelance",
  "Business",
  "Gift",
  "Investment",
  "Other",
];

function loadSavedCategories(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export default function TransactionList({
  transactions,
  searchedTransactions,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortOrder,
  setSortOrder,
  handleClearTransactions,
  handleDeleteTransaction,
  handleEditTransaction,
}) {
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const currency = localStorage.getItem("currency") || "ETB";

  // Include built-in, custom, and previously used categories.
  const categories = [
    ...new Set([
      ...DEFAULT_CATEGORIES,
      ...loadSavedCategories("incomeCategories"),
      ...loadSavedCategories("expenseCategories"),
      ...transactions.map((item) => item.category).filter(Boolean),
    ]),
  ].sort((a, b) => {
    if (a === "Other") return 1;
    if (b === "Other") return -1;
    return a.localeCompare(b);
  });

  function formatCurrency(value) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number(value));
    } catch {
      return `${currency} ${Number(value).toLocaleString()}`;
    }
  }

  function formatDate(date, id) {
    const parsedDate = new Date(date || id);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function confirmDelete() {
    if (!transactionToDelete) return;

    handleDeleteTransaction(transactionToDelete.id);
    setTransactionToDelete(null);
  }

  return (
    <>
      <section className="mt-8 w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Section heading */}
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              <Wallet size={22} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                All Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Your complete financial activity
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="rounded-xl bg-indigo-50 px-3 py-2 text-sm font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
              {searchedTransactions.length} shown
            </span>

            {transactions.length > 0 && (
              <button
                type="button"
                onClick={handleClearTransactions}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Search and filters */}
        <div className="space-y-4 border-b border-slate-100 p-5 dark:border-slate-800 sm:px-7 sm:py-6">
          <div className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              aria-label="Search transactions"
              placeholder="Search by transaction name or category..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-900 caret-indigo-600 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:caret-indigo-400 dark:placeholder:text-slate-400 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Category filter */}
            <div>
              <label
                htmlFor="category-filter"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Category
              </label>

              <div className="relative">
                <select
                  id="category-filter"
                  value={filterCategory}
                  onChange={(event) =>
                    setFilterCategory(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 pr-10 text-sm font-semibold text-indigo-900 outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-200"
                >
                  <option value="All">All Categories</option>

                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <svg
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-600 dark:text-indigo-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19 9-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Date sorting */}
            <div>
              <label
                htmlFor="date-sort"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
              >
                Sort by date
              </label>

              <div className="relative">
                <ArrowUpDown
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="date-sort"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction rows */}
        <div className="p-4 sm:p-6">
          {searchedTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-5 py-14 text-center dark:border-slate-700">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Search size={25} />
              </div>

              <h3 className="font-bold text-slate-800 dark:text-white">
                No transactions found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Try another search term or category, or add a new transaction from your dashboard.
              </p>

              {(searchTerm || filterCategory !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setFilterCategory("All");
                  }}
                  className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <ul className="space-y-3">
              {searchedTransactions.map((item) => {
                const isIncome = item.type === "income";

                return (
                  <li
                    key={item.id}
                    className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition duration-200 hover:border-indigo-100 hover:bg-slate-50/70 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 sm:flex-row sm:items-center sm:justify-between sm:p-5"
                  >
                    {/* Transaction information */}
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                          isIncome
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp size={23} />
                        ) : (
                          <TrendingDown size={23} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="break-words font-bold text-slate-900 dark:text-white">
                          {item.title || "Untitled transaction"}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="rounded-lg bg-slate-100 px-2 py-1 font-medium dark:bg-slate-800">
                            {item.category || "Other"}
                          </span>

                          <span>{formatDate(item.date, item.id)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Amount and actions */}
                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:justify-end sm:border-0 sm:pt-0">
                      <div className="sm:text-right">
                        <p
                          className={`text-base font-extrabold tracking-tight ${
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isIncome ? "+" : "−"}
                          {formatCurrency(item.amount)}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {isIncome ? "Income" : "Expense"}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${item.title || "transaction"}`}
                          title="Edit transaction"
                          onClick={() =>
                            handleEditTransaction(item.id)
                          }
                          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Delete ${item.title || "transaction"}`}
                          title="Delete transaction"
                          onClick={() => setTransactionToDelete(item)}
                          className="rounded-xl p-2.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Custom delete confirmation dialog */}
      {transactionToDelete && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setTransactionToDelete(null);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h2
                    id="delete-dialog-title"
                    className="text-lg font-extrabold text-slate-900 dark:text-white"
                  >
                    Delete transaction?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close delete confirmation"
                onClick={() => setTransactionToDelete(null)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <p
                id="delete-dialog-description"
                className="break-words text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                Are you sure you want to delete{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  "{transactionToDelete.title || "Untitled transaction"}"
                </span>
                ?
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTransactionToDelete(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
                >
                  <Trash2 size={17} />
                  Delete transaction
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
