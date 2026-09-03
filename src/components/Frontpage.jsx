import { useState } from "react";

export default function Frontpage() {
  // State for form inputs
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  // Dynamic state array to hold list of transactions
  const [transactions, setTransactions] = useState([
    { id: 1, title: "Salary", amount: 500, type: "income" },
    { id: 2, title: "Lunch", amount: 15, type: "expense" },
  ]);

  // Handle submitting new transaction
 const handleAddTransaction= (e)  => {
    e.preventDefault();
    if (!title || !amount) return; // Prevent adding empty transactions

      const newTransaction = { 
        id: Date.now(),
        title: title.trim(),
        amount: parseFloat(amount),
        type,
      }
      setTransactions([newTransaction, ...transactions]);
      setTitle("");
      setAmount("");
      setType("income");
  }

  const incomeTransactions = transactions.filter((item) => item.type === "income");
  const totalIncome = incomeTransactions.reduce((total, item) => total + item.amount, 0);

  const expenseTransactions = transactions.filter((item) => item.type === "expense");
  const totalExpenses = expenseTransactions.reduce((total, item) => total + item.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">Expense Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to the Expense Tracker!</p>
      </div>

      {/* Summary Dashboard Cards */}
      <div className="flex items-center gap-2.5 w-full max-w-md mt-6">
        {/* Balance Card (Bigger & Highlighted) */}
        <div className="flex-[1.25] bg-white p-5 rounded-xl shadow-md text-center border-2 border-indigo-500">
          <h2 className="text-[11px] uppercase font-bold text-indigo-600">Balance</h2>
          <p className="text-xl font-extrabold text-gray-900 mt-1">${(totalIncome - totalExpenses).toFixed(2)}</p>
        </div>

        {/* Income Card */}
        <div className="flex-1 bg-white p-3.5 rounded-xl shadow-md text-center">
          <h2 className="text-[10px] uppercase font-semibold text-emerald-600">Income</h2>
          <p className="text-base font-bold text-emerald-600 mt-1">${totalIncome.toFixed(2)}</p>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-3.5 rounded-xl shadow-md text-center flex-1">
          <h2 className="text-[10px] uppercase font-semibold text-rose-600">Expenses</h2>
          <p className="text-base font-bold text-rose-600 mt-1">${totalExpenses.toFixed(2)} </p>
        </div>
      </div>

      {/* Dynamic Recent Transactions Card */}
      <div className="bg-white rounded-xl shadow-md p-5 mt-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-800">Recent Transactions</h2>
          <span className="text-xs text-gray-400 font-medium">
            {transactions.length} Items
          </span>
        </div>

        <ul className="space-y-2.5">
          {transactions.map((item) => (
            <li
              key={item.id}
              className={`flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border-l-4 transition ${
                item.type === "income" ? "border-emerald-500" : "border-rose-500"
              }`}
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
                <p className="text-[11px] text-gray-400 capitalize">{item.type}</p>
              </div>
              <span
                className={`font-bold text-sm ${
                  item.type === "income" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {item.type === "income" ? "+" : "-"}${Number(item.amount).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Transaction Form */}
      <div className="bg-white rounded-xl shadow-md p-5 mt-4 w-full max-w-md mb-10">
        <h2 className="text-base font-bold text-gray-800 mb-4">Add New Transaction</h2>

        <form onSubmit={handleAddTransaction} className="space-y-3.5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
            <input
              type="text"
              placeholder="e.g. Salary, Coffee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Amount and Type Side-by-Side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Amount ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>

            {/* Type Select */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm mt-1"
          >
            + Add Transaction
          </button>
        </form>
      </div>
    </div>
  );
}