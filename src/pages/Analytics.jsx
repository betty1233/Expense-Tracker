
import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ChartNoAxesCombined,
  CalendarDays,
} from "lucide-react";

export default function Analytics({ transactions = [] }) {
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const currency = localStorage.getItem("currency") || "USD";

  function formatMoney(amount) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(Number(amount) || 0);
    } catch {
      return `${currency} ${(Number(amount) || 0).toLocaleString()}`;
    }
  }

  function getTransactionDate(item) {
    const dateValue = item.date
      ? new Date(item.date)
      : typeof item.id === "number" && item.id > 1000000000000
        ? new Date(item.id)
        : null;

    if (!dateValue || Number.isNaN(dateValue.getTime())) {
      return null;
    }

    return dateValue;
  }

  // Get transactions for the selected month and year.
  const monthlyTransactions = transactions.filter((item) => {
    const date = getTransactionDate(item);

    return (
      date &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  // Calculate monthly totals.
  const totalIncome = monthlyTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + (Number(item.amount) || 0), 0);

  const totalExpenses = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + (Number(item.amount) || 0), 0);

  const balance = totalIncome - totalExpenses;

  // Group income by category.
  const incomeByCategory = monthlyTransactions
    .filter((item) => item.type === "income")
    .reduce((totals, item) => {
      const category = item.category || "Other";
      totals[category] =
        (totals[category] || 0) + (Number(item.amount) || 0);
      return totals;
    }, {});

  // Group expenses by category.
  const expensesByCategory = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((totals, item) => {
      const category = item.category || "Other";
      totals[category] =
        (totals[category] || 0) + (Number(item.amount) || 0);
      return totals;
    }, {});

  // Combine both breakdowns into ONE chart.
  const chartData = [
    ...Object.entries(incomeByCategory).map(([category, amount]) => ({
      name: category,
      label: `Income · ${category}`,
      amount,
      type: "income",
    })),
    ...Object.entries(expensesByCategory).map(([category, amount]) => ({
      name: category,
      label: `Expense · ${category}`,
      amount,
      type: "expense",
    })),
  ].sort((a, b) => b.amount - a.amount);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, index) => currentDate.getFullYear() - 2 + index
  );

  const topIncome = Object.entries(incomeByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const topExpense = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white sm:px-8 sm:py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Page heading */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              YOUR MONEY AT A GLANCE
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Analytics
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              See where your money comes from and where it goes.
            </p>
          </div>

          {/* Month and year selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
              <CalendarDays
                size={18}
                className="text-indigo-500"
              />

              <select
                aria-label="Select month"
                value={selectedMonth}
                onChange={(event) =>
                  setSelectedMonth(Number(event.target.value))
                }
                className="max-w-36 bg-transparent py-3 text-sm font-semibold outline-none dark:text-white"
              >
                {months.map((month, index) => (
                  <option
                    key={month}
                    value={index}
                    className="text-slate-900"
                  >
                    {month}
                  </option>
                ))}
              </select>
            </div>

            <select
              aria-label="Select year"
              value={selectedYear}
              onChange={(event) =>
                setSelectedYear(Number(event.target.value))
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            >
              {years.map((year) => (
                <option
                  key={year}
                  value={year}
                  className="text-slate-900"
                >
                  {year}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Income
              </p>

              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <TrendingUp size={21} />
              </div>
            </div>

            <p className="mt-4 break-words text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatMoney(totalIncome)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Money received this month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Total Expenses
              </p>

              <div className="rounded-xl bg-rose-50 p-3 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <TrendingDown size={21} />
              </div>
            </div>

            <p className="mt-4 break-words text-2xl font-extrabold text-rose-600 dark:text-rose-400">
              {formatMoney(totalExpenses)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Money spent this month
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Net Balance
              </p>

              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <Wallet size={21} />
              </div>
            </div>

            <p
              className={`mt-4 break-words text-2xl font-extrabold ${
                balance >= 0
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {formatMoney(balance)}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              Income minus expenses
            </p>
          </div>
        </section>

        {/* ONE combined chart */}
        <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <ChartNoAxesCombined size={22} />
            </div>

            <div>
              <h2 className="text-lg font-extrabold sm:text-xl">
                Income Sources & Spending
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Compare your income categories with your expense categories.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              Income
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              Expenses
            </div>
          </div>

          {chartData.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center text-center">
              <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-300">
                <ChartNoAxesCombined size={30} />
              </div>

              <h3 className="mt-4 font-bold">
                Nothing to analyze yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Add income or expense transactions for {months[selectedMonth]}{" "}
                {selectedYear} to see your financial breakdown.
              </p>
            </div>
          ) : (
            <div className="mt-5 h-[360px] w-full sm:h-[430px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 16,
                    left: 8,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    type="number"
                    tickFormatter={(value) =>
                      Number(value).toLocaleString()
                    }
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="label"
                    width={125}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatMoney(Number(value)),
                      "Amount",
                    ]}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      padding: "10px 14px",
                    }}
                    cursor={{ fill: "#eef2ff", opacity: 0.5 }}
                  />

                  <Bar
                    dataKey="amount"
                    name="Amount"
                    radius={[0, 7, 7, 0]}
                    maxBarSize={26}
                  >
                    {chartData.map((item, index) => (
                      <Cell
                        key={`${item.type}-${item.name}-${index}`}
                        fill={
                          item.type === "income"
                            ? "#10b981"
                            : "#f43f5e"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Key insights */}
          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:grid-cols-2">
            <div className="rounded-2xl bg-emerald-50/80 p-4 dark:bg-emerald-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Biggest income category
              </p>

              <p className="mt-2 break-words text-lg font-extrabold text-slate-900 dark:text-white">
                {topIncome ? topIncome[0] : "No income yet"}
              </p>

              <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                {topIncome ? formatMoney(topIncome[1]) : "Add income to get started"}
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50/80 p-4 dark:bg-rose-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Biggest spending category
              </p>

              <p className="mt-2 break-words text-lg font-extrabold text-slate-900 dark:text-white">
                {topExpense ? topExpense[0] : "No expenses yet"}
              </p>

              <p className="mt-1 text-sm text-rose-700 dark:text-rose-400">
                {topExpense ? formatMoney(topExpense[1]) : "Add expenses to get started"}
              </p>
            </div>
          </div>
        </section>

        {/* Transaction summary */}
        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <h2 className="text-lg font-extrabold">
            Monthly Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {months[selectedMonth]} {selectedYear}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Transactions
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {monthlyTransactions.length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Income Categories
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {Object.keys(incomeByCategory).length}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Expense Categories
              </p>

              <p className="mt-2 text-2xl font-extrabold">
                {Object.keys(expensesByCategory).length}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
