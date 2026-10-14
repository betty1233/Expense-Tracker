import { useState } from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { useState } from "react";

export default function App() {
  const [transactions, setTransactions] = useState(() => {
  const savedTransactions = JSON.parse(
    localStorage.getItem("transactions")
  );

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
});

useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}