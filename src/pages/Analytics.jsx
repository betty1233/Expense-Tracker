import { useState } from "react"
import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from "recharts";

export default function Analytics({ transactions = [] }) {

  const [selectedMonth, setSelectedMonth] =useState(
    new Date().getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
  new Date().getFullYear()
);
  const monthlyTransactions = transactions.filter((item) => {
  const date = item.date
    ? new Date(item.date)
    : typeof item.id === "number" && item.id > 1000000000000
      ? new Date(item.id)
      : null;
  
  if (!date || Number.isNaN(date.getTime())) {
    return false;
  }
    return (
    date.getMonth() === selectedMonth &&
    date.getFullYear() === selectedYear 
    );
 });
  
  // 1. Calculate income and expenses
  const totalIncome = monthlyTransactions.reduce((total, item) => {
    return item.type === "income"
      ? total + Number(item.amount || 0)
      : total;
  }, 0);

  const totalExpenses = monthlyTransactions.reduce((total, item) => {
    return item.type === "expense"
      ? total + Number(item.amount || 0)
      : total;
  }, 0);

  const balance = totalIncome - totalExpenses;

  const categoryTotals = monthlyTransactions
    .filter((item) => item.type === "expense")
    .reduce((totals, item) => {
      const category = item.category || "Other";

      totals[category] =
        (totals[category] || 0) + Number(item.amount || 0);

      return totals;
    }, {});

  const categories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const overviewData = [
    { name: "Income", amount: totalIncome },
    { name: "Expenses", amount: totalExpenses },
  ];

 const monthlyTrendData = Array.from({ length: 6 }, (_, index) => {
  const date = new Date(selectedYear, selectedMonth - 5 + index, 1);

  const monthTransactions = transactions.filter((item) => {
    const transactionDate = item.date
      ? new Date(item.date)
      : typeof item.id === "number" && item.id > 1000000000000
        ? new Date(item.id)
        : null;

    return (
      transactionDate &&
      !Number.isNaN(transactionDate.getTime()) &&
      transactionDate.getMonth() === date.getMonth() &&
      transactionDate.getFullYear() === date.getFullYear()
    );
  });

  const income = monthTransactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  const expenses = monthTransactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + Number(item.amount || 0), 0);

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    Income: income,
    Expenses: expenses,
  };
}); 

  const categoryChartData = categories.map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const chartColors= [
     "#6366f1",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  ];

  const formatMoney = (amount) =>
    `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
       {/* Page heading */}
<div className="mb-8">
  <h1 className="text-3xl font-bold text-gray-800">
    Analytics
  </h1>

  <p className="mt-2 text-gray-500">
    Understand your income, expenses, and spending habits.
  </p>

  <div className="mt-5 flex flex-wrap gap-3">
    <select
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(Number(e.target.value))}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2"
    >
      {[
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
      ].map((month, index) => (
        <option key={month} value={index}>
          {month}
        </option>
      ))}
    </select>

    <select
      value={selectedYear}
      onChange={(e) => setSelectedYear(Number(e.target.value))}
      className="rounded-lg border border-gray-300 bg-white px-4 py-2"
    >
    {Array.from(
  { length: 5 },
  (_, index) => new Date().getFullYear() - 2 + index
).map((year) => (
  <option key={year} value={year}>
    {year}
  </option>
))}
    </select>
  </div>
</div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Income
            </p>

            <p className="mt-3 text-2xl font-bold text-emerald-600">
              {formatMoney(totalIncome)}
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Money received
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Expenses
            </p>

            <p className="mt-3 text-2xl font-bold text-rose-600">
              {formatMoney(totalExpenses)}
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Money spent
            </p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Net Balance
            </p>

            <p
              className={`mt-3 text-2xl font-bold ${
                balance >= 0
                  ? "text-indigo-600"
                  : "text-rose-600"
              }`}
            >
              {formatMoney(balance)}
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Income minus expenses
            </p>
          </div>

        </div>

        {/* Charts */}
<div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

  {/* Income vs Expenses */}
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-xl font-semibold text-gray-800">
      Income vs Expenses
    </h2>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={overviewData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => formatMoney(Number(value))} />
        <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Monthly Income vs Expenses Trend */}
<div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
  <h2 className="mb-5 text-xl font-semibold text-gray-800">
    Monthly Income vs Expenses Trend
  </h2>

  <ResponsiveContainer width="100%" height={320}>
    <BarChart data={monthlyTrendData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip
        formatter={(value) => formatMoney(Number(value))}
      />

      <Legend />

      <Bar
        dataKey="Income"
        fill="#10b981"
        radius={[4, 4, 0, 0]}
      />

      <Bar
        dataKey="Expenses"
        fill="#f43f5e"
        radius={[4, 4, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

  {/* Spending by Category */}
  <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-xl font-semibold text-gray-800">
      Spending Breakdown
    </h2>

    {categoryChartData.length === 0 ? (
      <p className="py-8 text-center text-gray-400">
        Add expenses to see your spending chart.
      </p>
    ) : (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryChartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={95}
            label
          >
            {categoryChartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value) => formatMoney(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>

</div>

        {/* Transaction summary */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-800">
            Transaction Summary
          </h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Total Transactions
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                {monthlyTransactions.length}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Number of Expense Categories
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                {categories.length}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
