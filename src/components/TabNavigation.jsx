// src/components/TabNavigation.jsx

export default function TabNavigation({ tab, setTab }) {
  const tabs = [
    { key: "tables", label: "🪑 Tables" },
    { key: "menu", label: "📋 Menu" },
    { key: "orders", label: "🧾 Orders" },
    { key: "history", label: "📊 History" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow flex justify-around p-2 z-50">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`text-sm px-3 py-1 rounded-full transition-all font-medium ${
            tab === t.key ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
