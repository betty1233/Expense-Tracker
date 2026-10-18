
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // 4. Display the page
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
            if (window.confirm("Delete all transactions?")) {
              setTransactions([]);
            }
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
    </main>
  );
}
