
import { useEffect, useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Coins,
  Plus,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Frontpage({
  transactions,
  setTransactions,
  transactionToEdit,
  setTransactionToEdit,
}) {
  // 1. Form state
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 2. Currency
  const [currency] = useState(
    () => localStorage.getItem("currency") || "ETB"
  );

  // 3. Format money
  const formatCurrency = (value) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${Number(value).toLocaleString()}`;
    }
  };

  // 4. Categories
  const categories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Entertainment",
    "Other",
  ];

  // 5. Fill the form when editing a transaction
  useEffect(() => {
    if (transactionToEdit == null) return;

    const transaction = transactions.find(
      (item) => item.id === transactionToEdit
    );

    if (!transaction) return;

    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setType(transaction.type);
    setCategory(transaction.category || "Other");
    setEditingId(transaction.id);
    setIsFormOpen(true);
  }, [transactionToEdit, transactions]);

  // 6. Reset the form and close the modal
  function resetForm() {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setEditingId(null);
    setTransactionToEdit(null);
    setIsFormOpen(false);
  }

  // 7. Add or update a transaction
  function handleAddTransaction(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      alert("Please enter a transaction name.");
      return;
    }

    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      alert("Please enter an amount greater than zero.");
      return;
    }

    if (editingId !== null) {
      setTransactions((previousTransactions) =>
        previousTransactions.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: cleanTitle,
                amount: numericAmount,
                type,
                category,
              }
            : item
        )
      );
    } else {
      const newTransaction = {
        id: Date.now(),
        title: cleanTitle,
        amount: numericAmount,
        type,
        category,
        date: new Date().toISOString(),
      };

      setTransactions((previousTransactions) => [
        newTransaction,
        ...previousTransactions,
      ]);
    }

    resetForm();
  }

  // 8. Dashboard totals
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  // 9. Dashboard layout
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col">

        {/* Welcome header */}
        <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              YOUR FINANCIAL SPACE
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              My Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              See where your money stands and keep your finances organized.
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center self-start rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none sm:self-auto">
            <Wallet size={28} />
          </div>
        </header>

        {/* Summary cards */}
        <section
          aria-label="Financial summary"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {/* Balance */}
          <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200/60 dark:shadow-none">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-100">
                  Total Balance
                </p>

                <p className="mt-4 break-words text-3xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                  {formatCurrency(totalBalance)}
                </p>
              </div>

              <div className="rounded-2xl bg-white/15 p-3">
                <Wallet size={23} />
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-sm text-indigo-100">
              <ArrowUpRight size={17} />
              <span>Your current financial position</span>
            </div>

            <div className="pointer-events-none absolute -bottom-12 -right-8 h-36 w-36 rounded-full border-[22px] border-white/10" />
          </article>

          {/* Income */}
          <article className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-emerald-900/60 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Total Income
                </p>

                <p className="mt-4 break-words text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                  {formatCurrency(totalIncome)}
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                <TrendingUp size={23} />
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
              <ArrowDownRight size={17} />
              <span>Money coming in</span>
            </div>
          </article>

          {/* Expenses */}
          <article className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-rose-900/60 dark:bg-slate-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Total Expenses
                </p>

                <p className="mt-4 break-words text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl lg:text-2xl">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>

              <div className="rounded-2xl bg-rose-100 p-3 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                <TrendingDown size={23} />
              </div>
            </div>

            <div className="mt-7 flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-400">
              <ArrowUpRight size={17} />
              <span>Money going out</span>
            </div>
          </article>
        </section>

        {/* Open the form */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-bold text-white shadow-lg shadow-indigo-200/70 transition hover:-translate-y-0.5 hover:shadow-xl dark:shadow-none"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Transaction form modal */}
        {isFormOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={resetForm}
          >
            <div
              className="my-auto w-full max-w-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <section className="relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">

                {/* Purple form header */}
                <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-7 text-white sm:px-8">

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={resetForm}
                    aria-label="Close transaction form"
                    className="absolute right-4 top-4 rounded-lg p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/15 p-3">
                      <Wallet size={25} />
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold sm:text-2xl">
                        {editingId !== null
                          ? "Update Transaction"
                          : "Add Transaction"}
                      </h2>

                      <p className="mt-1 text-sm text-indigo-100">
                        Record where your money goes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <form
                  onSubmit={handleAddTransaction}
                  noValidate
                  className="space-y-6 p-6 sm:p-8"
                >
                  {/* Transaction name */}
                  <div>
                    <label
                      htmlFor="transaction-title"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Transaction name
                    </label>

                    <input
                      id="transaction-title"
                      type="text"
                      placeholder="e.g. Monthly salary, lunch..."
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                    />
                  </div>

                  {/* Amount and type */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="transaction-amount"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        Amount ({currency})
                      </label>

                      <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <Coins size={19} />
                        </span>

                        <input
                          id="transaction-amount"
                          type="number"
                          min="0.01"
                          step="any"
                          placeholder="0.00"
                          value={amount}
                          onChange={(event) =>
                            setAmount(event.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="transaction-type"
                        className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                      >
                        Transaction type
                      </label>

                      <select
                        id="transaction-type"
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="transaction-category"
                      className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200"
                    >
                      Category
                    </label>

                    <select
                      id="transaction-category"
                      value={category}
                      onChange={(event) =>
                        setCategory(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Form buttons */}
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 dark:border-slate-800 sm:flex-row">
                    <button
                      type="submit"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200/70 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 dark:shadow-none"
                    >
                      {editingId !== null ? (
                        <Check size={19} />
                      ) : (
                        <Plus size={19} />
                      )}

                      {editingId !== null
                        ? "Save Changes"
                        : "Add Transaction"}
                    </button>

                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <X size={17} />
                      Cancel
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
