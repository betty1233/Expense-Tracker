import { useState, useEffect } from "react";

export default function Frontpage() {
  // State for form inputs
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [editingId, setEditingId] = useState(null);
  const [category, setCategory] = useState("Food");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] =useState("")

  // Dynamic state array to hold list of transactions
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = JSON.parse(
      localStorage.getItem("transactions")
    );

    return (
      savedTransactions || [
        {
          id: 1,
          title: "Salary",
          amount: 500,
          type: "income",
          category: "Food",
        },
        {
          id: 2,
          title: "Lunch",
          amount: 15,
          type: "expense",
          category: "Food",
        },
      ]
    );
  });

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Handle adding and updating transactions
  const handleAddTransaction = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!amount) {
      alert("Please enter an amount.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)){
      alert("Please enter a valid number.");
      return;
    }

    if (numericAmount<=0){
      alert("Please enter an amount greater than 0.");
      return;
    }

    // Handle editing an existing transaction
    if (editingId !== null) {
      const updatedTransactions = transactions.map((item) => {
        if (item.id === editingId) {
          return {
            ...item,
            title: title.trim(),
            amount: numericAmount,
            type,
            category,
          };
        }

        return item;
      });

      setTransactions(updatedTransactions);
      setEditingId(null);
      setTitle("");
      setAmount("");
      setType("income");
      setCategory("Food");

      return;
    }

    // Handle adding a new transaction
    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      amount: numericAmount ,
      type,
      category,
      date: new Date().toISOString(), // Add a date property to the transaction
    };

    setTransactions([newTransaction, ...transactions]);

    setTitle("");
    setAmount("");
    setType("income");
    setCategory("Food");
  };

  // Handle deleting a transaction
  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(
      (item) => item.id !== id
    );

    setTransactions(updatedTransactions);
  };

  // Populate form with transaction data to edit
  const handleEditTransaction = (id) => {
    const transactionToEdit = transactions.find(
      (item) => item.id === id
    );

    if (transactionToEdit) {
      setTitle(transactionToEdit.title);
      setAmount(transactionToEdit.amount.toString());
      setType(transactionToEdit.type);
      setEditingId(id);
      setCategory(transactionToEdit.category);
    }
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setAmount("");
    setType("income");
    setCategory("Food");
  };

  // Calculate total income
  const incomeTransactions = transactions.filter(
    (item) => item.type === "income"
  );

  const totalIncome = incomeTransactions.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Calculate total expenses
  const expenseTransactions = transactions.filter(
    (item) => item.type === "expense"
  );

  const totalExpenses = expenseTransactions.reduce(
    (total, item) => total + item.amount,
    0
  );

  // Categories
  const categories = [
    "Food",
    "Transport",
    "Bills",
    "Shopping",
    "Entertainment",
    "Other",
  ];

  // Calculate spending for each category
  const categoryTotals = categories.map((category) => {
    const categoryTransactions = transactions.filter(
      (item) => item.category === category
    );

    const total = categoryTransactions.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    return {
      category: category,
      total: total,
    };
  });

  // Calculate balance
  const totalBalance = totalIncome - totalExpenses;

  // Filter transactions by category
  const filteredTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter(
          (item) => item.category === filterCategory
        );

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date || a.id).getTime();
    const dateB = new Date(b.date || b.id).getTime();

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const searchTransactions = sortedTransactions.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearTransactions = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to delete all transactions?"
    );

    if (confirmClear) {
      setTransactions([]);
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 px-4">

      {/* ================= HEADER ================= */}

      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Expense Tracker
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Welcome to the Expense Tracker!
        </p>
      </div>


      {/* ================= SUMMARY DASHBOARD ================= */}

      <div className="flex items-center gap-2.5 w-full max-w-md mt-6">

        {/* Balance Card */}
        <div className="flex-[1.25] bg-white p-5 rounded-xl shadow-md text-center border-2 border-indigo-500">
          <h2 className="text-[11px] uppercase font-bold text-indigo-600">
            Balance
          </h2>

          <p className="text-xl font-extrabold text-gray-900 mt-1">
            ${totalBalance.toFixed(2)}
          </p>
        </div>


        {/* Income Card */}
        <div className="flex-1 bg-white p-3.5 rounded-xl shadow-md text-center">
          <h2 className="text-[10px] uppercase font-semibold text-emerald-600">
            Income
          </h2>

          <p className="text-base font-bold text-emerald-600 mt-1">
            ${totalIncome.toFixed(2)}
          </p>
        </div>


        {/* Expenses Card */}
        <div className="bg-white p-3.5 rounded-xl shadow-md text-center flex-1">
          <h2 className="text-[10px] uppercase font-semibold text-rose-600">
            Expenses
          </h2>

          <p className="text-base font-bold text-rose-600 mt-1">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

      </div>


      {/* ================= CATEGORY + TRANSACTIONS GRID ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 w-full max-w-4xl">

        {/* ================= CATEGORY SPENDING ================= */}

        <div className="bg-indigo-50 p-5 rounded-2xl shadow-lg border border-indigo-200 w-full">

          <h2 className="text-xl font-bold text-indigo-800 mb-4">
            Category Spending
          </h2>

          <div className="grid grid-cols-2 gap-3">

            {categoryTotals.map((item) => (
              <div
                key={item.category}
                className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm"
              >

                <span className="font-semibold text-gray-700 text-sm">
                  {item.category}
                </span>

                <span className="font-bold text-indigo-600 text-sm">
                  ${item.total.toFixed(2)}
                </span>

              </div>
            ))}

          </div>

        </div>


        
          {/* Category Filter */}

          <div className="grid grid-cols-2 gap-2 mb-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>


          {/* Transaction List */}

          <ul className="space-y-2.5">
            {searchTransactions.length === 0 ? (
              <li className="text-center text-gray-400 text-sm py-4">
                No transactions found.
              </li>
            ) : (
              searchTransactions.map((item) => (
                <li
                  key={item.id}
                  className={`flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border-l-4 transition ${
                    item.type === "income"
                      ? "border-emerald-500"
                      : "border-rose-500"
                  }`}
                >
                  {/* Transaction Information */}
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-gray-400 capitalize">
                      {item.type}
                    </p>

                    <p className="text-[11px] text-gray-500">
                      {item.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.date || item.id).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Amount + Buttons */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-sm ${
                        item.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}$
                      {Number(item.amount).toFixed(2)}
                    </span>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTransaction(item.id)}
                      className="ml-2 text-gray-400 hover:text-rose-600 transition"
                    >
                      🗑️
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => handleEditTransaction(item.id)}
                      className="text-gray-400 hover:text-indigo-600 transition"
                    >
                      ✏️
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>


      {/* ================= ADD / UPDATE FORM ================= */}

      <div className="bg-white rounded-xl shadow-md p-5 mt-6 w-full max-w-md mb-10">

        <h2 className="text-base font-bold text-gray-800 mb-4">

          {editingId !== null
            ? "Update Transaction"
            : "+ Add Transaction"}

        </h2>


        <form
          onSubmit={handleAddTransaction} noValidate
          className="space-y-3.5"
        >

          {/* Title Input */}

          <div>

            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Title
            </label>

            <input
              type="text"
              placeholder="e.g. Salary, Coffee"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />

          </div>


          {/* Amount + Type */}

          <div className="grid grid-cols-2 gap-3">

            {/* Amount */}

            <div>

              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Amount ($)
              </label>

              <input
                type="number"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />

            </div>


            {/* Type */}

            <div>

              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Type
              </label>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >

                <option value="income">
                  Income
                </option>

                <option value="expense">
                  Expense
                </option>

              </select>

            </div>

          </div>


          {/* Category */}

          <div>

            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >

              <option value="Food">
                Food
              </option>

              <option value="Transport">
                Transport
              </option>

              <option value="Bills">
                Bills
              </option>

              <option value="Shopping">
                Shopping
              </option>

              <option value="Entertainment">
                Entertainment
              </option>

              <option value="Other">
                Other
              </option>

            </select>

          </div>


          {/* Submit Button */}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-sm mt-1"
          >

            {editingId !== null
              ? "Update Transaction"
              : "+ Add Transaction"}

          </button>


          {/* Cancel Button */}

          {editingId !== null && (

            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full bg-gray-200 hover:bg-gray-300 active:scale-[0.99] text-gray-700 font-semibold py-2.5 rounded-lg text-sm transition shadow-sm mt-1"
            >
              Cancel
            </button>

          )}

        </form>

      </div>

    </div>
  );
}