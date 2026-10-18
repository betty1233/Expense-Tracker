
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import TransactionList from "../components/TransactionList";

export default function Transactions({
  transactions,
  setTransactions,
  setTransactionToEdit,
}) {
  const navigate = useNavigate();

  // Search, filter, and sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // State for the Clear All confirmation dialog
  const [showClearConfirmation, setShowClearConfirmation] =
    useState(false);

  // 1. Filter by category
  const filteredTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter(
          (item) =>
            (item.category || "").toLowerCase() ===
            filterCategory.toLowerCase()
        );

  // 2. Sort by date
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => {
      const dateA = new Date(a.date || a.id).getTime();
      const dateB = new Date(b.date || b.id).getTime();

      return sortOrder === "newest"
        ? dateB - dateA
        : dateA - dateB;
    }
  );

  // 3. Search by title or category
  const searchedTransactions = sortedTransactions.filter(
    (item) =>
      (item.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.category || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // 4. Confirm clearing all transactions
  function confirmClearTransactions() {
    setTransactions([]);
    setShowClearConfirmation(false);
    setSearchTerm("");
    setFilterCategory("All");
    setSortOrder("newest");
  }

  // 5. Display the page
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* Page header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              YOUR FINANCIAL ACTIVITY
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Transactions
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              View, search, and manage your income and expenses.
            </p>
          </div>

          {/* Transaction count */}
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-indigo-100 bg-white px-5 py-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              <span className="text-lg font-bold">#</span>
            </div>

            <div>
              <p className="text-2xl font-extrabold">
                {transactions.length}
              </p>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total transactions
              </p>
            </div>
          </div>
        </header>

        {/* Transaction list and controls */}
        <TransactionList
          transactions={transactions}
          searchedTransactions={searchedTransactions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleClearTransactions={() => {
            setShowClearConfirmation(true);
          }}
          handleDeleteTransaction={(id) => {
            setTransactions((current) =>
              current.filter((item) => item.id !== id)
            );
          }}
          handleEditTransaction={(id) => {
            setTransactionToEdit(id);
            navigate("/dashboard");
          }}
        />
      </div>

      {/* Custom Clear All confirmation dialog */}
      {showClearConfirmation && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowClearConfirmation(false);
            }
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="clear-dialog-title"
            aria-describedby="clear-dialog-description"
            className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
          >
            {/* Dialog header */}
            <div className="flex items-start justify-between border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                  <AlertTriangle size={24} />
                </div>

                <div>
                  <h2
                    id="clear-dialog-title"
                    className="text-lg font-extrabold text-slate-900 dark:text-white"
                  >
                    Clear all transactions?
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Close confirmation"
                onClick={() => setShowClearConfirmation(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            {/* Dialog body */}
            <div className="p-5 sm:p-6">
              <p
                id="clear-dialog-description"
                className="text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                You are about to delete all{" "}
                <span className="font-bold text-slate-900 dark:text-white">
                  {transactions.length} transactions
                </span>
                . Your income and expense records will be removed from this list.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowClearConfirmation(false)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmClearTransactions}
                  className="flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
                >
                  <Trash2 size={17} />
                  Delete all
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
