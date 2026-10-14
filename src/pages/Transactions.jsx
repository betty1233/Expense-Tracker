
import { useState } from "react";
import TransactionList from "../components/TransactionList";

export default function Transactions({
  transactions,
  setTransactions,
  setTransactionToEdit,

}) {
  // Search, filter, and sorting state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  // 1. Filter transactions by category
  const filteredTransactions =
    filterCategory === "All"
      ? transactions
      : transactions.filter(
          (item) =>
          (item.category || "").toLowerCase() ===
          filterCategory.toLowerCase()
        );

  // 2. Sort transactions by date
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
      item.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Display the Transactions page
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Transactions
      </h1>

      <p className="mt-2 mb-6 text-sm text-gray-500">
        View, search, filter, and manage all your income and expenses.
      </p>

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
          window.location.href ="/dashboard"
        }}
      />
    </div>
  );
}
