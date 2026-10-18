
import { useState } from "react";
import {
  Palette,
  Coins,
  Database,
  Trash2,
  Sun,
  Moon,
  ChevronDown,
  Settings as SettingsIcon,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Settings({
  theme = "Light",
  setTheme = () => {},
  transactions = [],
  setTransactions,
}) {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("currency") || "ETB"
  );

  const [showSaved, setShowSaved] = useState(false);

  function handleCurrencyChange(event) {
    const newCurrency = event.target.value;

    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);

    setShowSaved(true);
  }

  function handleThemeChange(event) {
    const newTheme = event.target.value;

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function handleClearData() {
    if (typeof setTransactions !== "function") {
      window.alert("Data management is not connected yet.");
      return;
    }

    if (transactions.length === 0) {
      window.alert("There are no transactions to delete.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete ALL transactions? This action cannot be undone."
    );

    if (confirmed) {
      setTransactions([]);
      window.alert("All transactions have been cleared.");
    }
  }

  const currencyOptions = [
    { value: "ETB", label: "Ethiopian Birr (ETB)" },
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "KES", label: "Kenyan Shilling (KES)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl">
        {/* Page heading */}
        <header className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              <SettingsIcon size={24} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
                PERSONALIZE YOUR APP
              </p>

              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Settings
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400 sm:text-base">
            Customize your experience, choose your currency, and manage your financial data.
          </p>
        </header>

        {/* Appearance settings */}
        <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Palette size={21} />
            </div>

            <div>
              <h2 className="font-extrabold">Appearance</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose how your application looks.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <label
              htmlFor="theme-setting"
              className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              Color theme
            </label>

            <div className="relative">
              <select
                id="theme-setting"
                value={theme}
                onChange={handleThemeChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-semibold outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  theme === "Light"
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <Sun size={22} className="text-amber-500" />

                <div>
                  <p className="text-sm font-bold">Light mode</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Bright and clean
                  </p>
                </div>

                {theme === "Light" && (
                  <CheckCircle2
                    size={18}
                    className="ml-auto text-indigo-600 dark:text-indigo-300"
                  />
                )}
              </div>

              <div
                className={`flex items-center gap-3 rounded-2xl border p-4 ${
                  theme === "Dark"
                    ? "border-indigo-300 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                }`}
              >
                <Moon size={22} className="text-indigo-500" />

                <div>
                  <p className="text-sm font-bold">Dark mode</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Easy on the eyes
                  </p>
                </div>

                {theme === "Dark" && (
                  <CheckCircle2
                    size={18}
                    className="ml-auto text-indigo-600 dark:text-indigo-300"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Currency settings */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800 sm:p-6">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Coins size={21} />
            </div>

            <div>
              <h2 className="font-extrabold">Currency</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Choose the currency displayed in your app.
              </p>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <label
              htmlFor="currency-setting"
              className="mb-3 block text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              Display currency
            </label>

            <div className="relative">
              <select
                id="currency-setting"
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-semibold outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {currencyOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-indigo-500"
              />
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-bold">
                  {showSaved ? "Currency saved!" : "Currency preference"}
                </p>

                <p className="mt-1 text-xs leading-5">
                  Your selected currency is {currency}. Currency selection changes the display preference; it does not convert existing transaction amounts using exchange rates.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data management */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm dark:border-rose-500/20 dark:bg-slate-900">
          <div className="flex items-center gap-3 border-b border-rose-100 p-5 dark:border-rose-500/20 sm:p-6">
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <Database size={21} />
            </div>

            <div>
              <h2 className="font-extrabold">Data Management</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Manage your saved transactions.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={21}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>
                <p className="font-bold">Clear all transactions</p>

                <p className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400">
                  {transactions.length} saved transaction
                  {transactions.length === 1 ? "" : "s"}. This action cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClearData}
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-slate-900 dark:text-rose-400 dark:hover:bg-rose-500/10"
            >
              <Trash2 size={17} />
              Clear data
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Expense Tracker
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Your money, organized.
          </p>
        </footer>
      </div>
    </main>
  );
}
