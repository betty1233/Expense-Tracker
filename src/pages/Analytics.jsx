import { ResponsiveContainer, PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from "recharts";

export default function Analytics({ transactions = [] }) {
  // 1. Calculate income and expenses
  const totalIncome = transactions.reduce((total, item) => {
    return item.type === "income"
      ? total + Number(item.amount || 0)
      : total;
  }, 0);

  const totalExpenses = transactions.reduce((total, item) => {
    return item.type === "expense"
      ? total + Number(item.amount || 0)
      : total;
  }, 0);

  const balance = totalIncome - totalExpenses;

  const categoryTotals = transactions
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Analytics
          </h1>

          <p className="mt-2 text-gray-500">
            Understand your income, expenses, and spending habits.
          </p>
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
                {transactions.length}
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
