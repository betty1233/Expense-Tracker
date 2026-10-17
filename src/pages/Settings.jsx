export default function Settings({ theme, setTheme }) {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
          Customize how the app looks and behaves.
        </p>

        <div className="mt-6 rounded-xl bg-white p-5 shadow-md dark:bg-gray-800">
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Theme
          </label>

          <select
            value={theme}
            onChange={(e) => {
              const newTheme = e.target.value;
              setTheme(newTheme);
              localStorage.setItem("theme", newTheme);
            }}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="Light">Light</option>
            <option value="Dark">Dark</option>
          </select>
        </div>
      </div>
    </div>
  );
}