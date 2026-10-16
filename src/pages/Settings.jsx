import { useState } from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const [currency, setCurrency] = useState(() => 
    localStorage.getItem("currency") || "USD");
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "Light"
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Customize your Expense Tracker.
        </p>

        {/* Appearance settings */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Appearance
          </h2>

          <div className="mt-5 flex items-center justify-between gap-4">
            <label htmlFor="theme" className="text-gray-700">
              Theme
            </label>

            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>

        {/* Currency settings */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Currency</h2>

          <div className="mt-5 flex items-center justify-between gap-4">
            <label htmlFor="currency" className="text-gray-700">
              Display currency
            </label>

            <select
              id="currency"
              value={currency}
              onChange={(e) => {
                const newCurrency = e.target.value;
                setCurrency(newCurrency);
                localStorage.setItem("currency", newCurrency);
}}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2"
            >
              <option value="USD">US Dollar ($)</option>
              <option value="ETB">Ethiopian Birr (Br)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">
            Navigation
          </h2>

          <Link
            to="/dashboard"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}