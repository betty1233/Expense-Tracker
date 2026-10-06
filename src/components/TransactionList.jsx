export default function TransactionList({
  transactions,
  searchedTransactions,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  sortOrder,
  setSortOrder,
  handleClearTransactions,
  handleDeleteTransaction,
  handleEditTransaction,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-semibold">
          Recent Transactions
        </h2>

        {searchedTransactions.length > 0 && (
          <button
            onClick={handleClearTransactions}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear All
          </button>
        )}

      </div>

      <span className="text-xs text-gray-400 font-medium">
        {transactions.length} Items
      </span>

      <input
        type="text"
        placeholder="Search Transactions ..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

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

        {searchedTransactions.length === 0 ? (
          <li className="text-center text-gray-400 text-sm py-4">
            No transactions found.
          </li>
        ) : (
          searchedTransactions.map((item) => (

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
  );
}