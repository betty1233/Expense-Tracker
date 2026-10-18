
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
  Tag,
} from "lucide-react";

const DEFAULT_INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Gift",
  "Investment",
  "Other",
];

const DEFAULT_EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Entertainment",
  "Other",
];

function loadCategories(key, defaults) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) && saved.length > 0
      ? [...new Set([...defaults, ...saved])]
      : defaults;
  } catch {
    return defaults;
  }
}

export default function Frontpage({
  transactions,
  setTransactions,
  transactionToEdit,
  setTransactionToEdit,
}) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");

  const [incomeCategories, setIncomeCategories] = useState(() =>
    loadCategories("incomeCategories", DEFAULT_INCOME_CATEGORIES)
  );

  const [expenseCategories, setExpenseCategories] = useState(() =>
    loadCategories("expenseCategories", DEFAULT_EXPENSE_CATEGORIES)
  );

  const [currency] = useState(
    () => localStorage.getItem("currency") || "ETB"
  );

  const categories =
    type === "income" ? incomeCategories : expenseCategories;

  const availableCategories = categories.includes(category)
    ? categories
    : [...categories, category];

  function formatCurrency(value) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${Number(value).toLocaleString()}`;
    }
  }

  // Load an existing transaction into the form for editing.
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
    setNewCategory("");
    setCategoryMessage("");
    setIsFormOpen(true);
  }, [transactionToEdit, transactions]);

  function resetForm() {
    setTitle("");
    setAmount("");
    setType("expense");
    setCategory("Food");
    setEditingId(null);
    setNewCategory("");
    setCategoryMessage("");
    setTransactionToEdit(null);
    setIsFormOpen(false);
  }

  // Switch to a category list appropriate for the selected type.
  function handleTypeChange(event) {
    const newType = event.target.value;

    setType(newType);
    setCategory(
      newType === "income"
        ? incomeCategories[0]
        : expenseCategories[0]
    );
    setNewCategory("");
    setCategoryMessage("");
  }

  // Add and save a custom category for the selected transaction type.
  function handleAddCategory() {
    const cleanCategory = newCategory.trim();

    if (!cleanCategory) {
      setCategoryMessage("Please enter a category name.");
      return;
    }

    if (cleanCategory.length > 30) {
      setCategoryMessage("Use 30 characters or fewer.");
      return;
    }

    const existingCategories =
      type === "income" ? incomeCategories : expenseCategories;

    const duplicate = existingCategories.some(
      (item) => item.toLowerCase() === cleanCategory.toLowerCase()
    );

    if (duplicate) {
      setCategoryMessage("This category already exists.");
      return;
    }

    const updatedCategories = [...existingCategories, cleanCategory];

    if (type === "income") {
      setIncomeCategories(updatedCategories);
      localStorage.setItem(
        "incomeCategories",
        JSON.stringify(updatedCategories)
      );
    } else {
      setExpenseCategories(updatedCategories);
      localStorage.setItem(
        "expenseCategories",
        JSON.stringify(updatedCategories)
      );
    }

    setCategory(cleanCategory);
    setNewCategory("");
    setCategoryMessage(`"${cleanCategory}" added successfully.`);
  }

  function handleAddTransaction(event) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const numericAmount = Number(amount);

    if (!cleanTitle) {
      window.alert("Please enter a transaction name.");
      return;
    }

    if (
      amount.trim() === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      window.alert("Please enter an amount greater than zero.");
      return;
    }

    if (!category.trim()) {
      window.alert("Please select a category.");
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

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
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

        <section
          aria-label="Financial summary"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
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
                <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 px-6 py-7 text-white sm:px-8">
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

                <form
                  onSubmit={handleAddTransaction}
                  noValidate
                  className="space-y-6 p-6 sm:p-8"
                >
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
                    />
                  </div>

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
                          onChange={(event) => setAmount(event.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400 dark:focus:bg-slate-800"
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
                        onChange={handleTypeChange}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    </div>
                  </div>

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
                      onChange={(event) => setCategory(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {availableCategories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add a custom category */}
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <div className="mb-3 flex items-center gap-2">
                      <Tag
                        size={18}
                        className="text-indigo-600 dark:text-indigo-400"
                      />

                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        Create your own {type} category
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={newCategory}
                        maxLength={30}
                        placeholder={
                          type === "income"
                            ? "e.g. Tutoring, Scholarship..."
                            : "e.g. Healthcare, Rent..."
                        }
                        onChange={(event) => {
                          setNewCategory(event.target.value);
                          setCategoryMessage("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddCategory();
                          }
                        }}
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-400"
                      />

                      <button
                        type="button"
                        onClick={handleAddCategory}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
                      >
                        <Plus size={17} />
                        Add category
                      </button>
                    </div>

                    {categoryMessage && (
                      <p
                        aria-live="polite"
                        className="mt-3 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                      >
                        {categoryMessage}
                      </p>
                    )}

                    <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Custom categories are saved separately for income and expenses, and remain available after refreshing.
                    </p>
                  </div>

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
