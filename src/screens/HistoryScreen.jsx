import { useState, useMemo } from "react";
import { useOrder } from "../context/OrderContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f"];

function formatDateInput(dateStr) {
  const date = new Date(dateStr);
  return date.toISOString().split("T")[0];
}

export default function HistoryScreen() {
  const { orderHistory } = useOrder();
  const [showReport, setShowReport] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const filteredOrders = useMemo(() => {
    return orderHistory.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchFrom = fromDate ? entryDate >= new Date(fromDate) : true;
      const matchTo = toDate ? entryDate <= new Date(toDate) : true;
      const matchTable = selectedTable ? entry.table === selectedTable : true;
      return matchFrom && matchTo && matchTable;
    });
  }, [orderHistory, fromDate, toDate, selectedTable]);

  const revenueByDate = useMemo(() => {
    const grouped = {};
    filteredOrders.forEach((entry) => {
      const date = new Date(entry.date).toLocaleDateString();
      if (!grouped[date]) grouped[date] = 0;
      grouped[date] += entry.total;
    });
    return Object.entries(grouped).map(([date, total]) => ({ date, total }));
  }, [filteredOrders]);

  const revenueByTable = useMemo(() => {
    const grouped = {};
    filteredOrders.forEach((entry) => {
      if (!grouped[entry.table]) grouped[entry.table] = 0;
      grouped[entry.table] += entry.total;
    });
    return Object.entries(grouped).map(([table, total]) => ({ name: table, value: total }));
  }, [filteredOrders]);

  const totalRevenue = filteredOrders.reduce((sum, e) => sum + e.total, 0);
  const totalTips = filteredOrders.reduce((sum, e) => sum + (e.tip || 0), 0);

  const allTables = [...new Set(orderHistory.map((o) => o.table))];

  if (!showReport) {
    return (
      <div className="p-4 pb-24">
        <h2 className="text-lg font-bold mb-4">Order History</h2>

        {orderHistory.length === 0 ? (
          <div className="text-gray-500 text-center">No orders paid yet.</div>
        ) : (
          <div className="space-y-3 mb-6">
            {orderHistory.map((entry, index) => (
              <div
                key={index}
                className="bg-white rounded shadow p-4 text-sm space-y-1"
              >
                <div className="text-blue-600 font-semibold">
                  {entry.table}
                </div>
                <div>Date: {new Date(entry.date).toLocaleString()}</div>
                <div>
                  Items: {entry.items.map((item, idx) => (
                    <span key={idx}>
                      {item.quantity}× {item.name}
                      {idx < entry.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <div>Total: ${entry.total.toFixed(2)}</div>
                {entry.tip ? <div>Tip: ${entry.tip.toFixed(2)}</div> : null}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={() => setShowReport(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          >
            📊 View Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-bold mb-4">📊 Manager Report</h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 text-sm">
        <div>
          <label className="block font-medium mb-1">From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {allTables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Revenue by Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByDate}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="font-semibold mb-2">Revenue by Table</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByTable}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {revenueByTable.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm mb-6">
        <div className="font-semibold">Filtered Orders: {filteredOrders.length}</div>
        <div>Total Revenue (no tips): ${totalRevenue.toFixed(2)}</div>
        <div>Total Tips: ${totalTips.toFixed(2)}</div>
      </div>

      <button
        onClick={() => setShowReport(false)}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400"
      >
        ⬅ Back to History
      </button>
    </div>
  );
}
