import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "Light";
    } catch {
      return "Light";
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
      return savedTransactions || [
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
      ];
    } catch {
      return [
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
      ];
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "Dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const [transactionToEdit, setTransactionToEdit] = useState(null);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                transactions={transactions}
                setTransactions={setTransactions}
                transactionToEdit={transactionToEdit}
                setTransactionToEdit={setTransactionToEdit}
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                transactions={transactions}
                setTransactions={setTransactions}
                transactionToEdit={transactionToEdit}
                setTransactionToEdit={setTransactionToEdit}
              />
            }
          />

          <Route
            path="/transactions"
            element={
              <Transactions
                transactions={transactions}
                setTransactions={setTransactions}
                setTransactionToEdit={setTransactionToEdit}
              />
            }
          />

          <Route
            path="/analytics"
            element={<Analytics transactions={transactions} />}
          />

          <Route
            path="/settings"
            element={<Settings theme={theme} setTheme={setTheme} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}