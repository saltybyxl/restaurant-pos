import { useState } from "react";
import { useOrder } from "../context/OrderContext";

export default function OrdersScreen() {
  const {
    selectedTable,
    setSelectedTable,
    orders,
    removeItem,
    updateItemQuantity,
    clearTable,
  } = useOrder();

  const activeTable = selectedTable || Object.keys(orders)[0];
  const orderData = orders[activeTable] || { items: [] };
  const orderItems = orderData.items || [];


  const [tipInput, setTipInput] = useState("");
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [splitMode, setSplitMode] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [assigned, setAssigned] = useState({});

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tip = parseFloat(tipInput) || 0;
  const grandTotal = total + tip;

  const handleOpenEdit = (index) => {
    setEditItemIndex(index);
    setEditQuantity(orderItems[index].quantity);
  };

  const handleUpdate = () => {
    updateItemQuantity(activeTable, editItemIndex, editQuantity);
    setEditItemIndex(null);
  };

  const handleRemove = () => {
    removeItem(activeTable, editItemIndex);
    setEditItemIndex(null);
  };

  const handleSplitBill = () => {
    setSplitMode(true);
  };

  const getSplitSummary = () => {
    const splitTotals = Array(splitCount).fill(0);
    orderItems.forEach((item, index) => {
      const guest = assigned[index];
      if (guest !== undefined) {
        splitTotals[guest] += item.price * item.quantity;
      }
    });
    return splitTotals.map((amount) => amount + tip / splitCount);
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-bold mb-4">🧾 Current Order</h2>

      {!activeTable ? (
        <div className="text-center text-red-600 font-semibold">
          No table selected and no orders found.
        </div>
      ) : orderItems.length === 0 ? (
        <div className="text-center text-gray-600">No items yet.</div>
      ) : (
        <>
          {Object.keys(orders).length > 0 && (
            <div className="mb-4">
              <label className="block text-sm mb-1">Select Table:</label>
              <select
                value={activeTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="border rounded px-3 py-1 w-full"
              >
                {Object.keys(orders).map((tableName) => (
                  <option key={tableName} value={tableName}>
                    {tableName}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ul className="space-y-2 mb-4">
            {orderItems.map((item, index) => (
              <li
                key={index}
                className="bg-white rounded p-3 shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => handleOpenEdit(index)}
              >
                <div className="flex justify-between font-medium">
                  <span>{item.name}</span>
                  <span>
                    x{item.quantity} • €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                {item.notes && (
                  <div className="text-xs text-gray-500 mt-1">📝 {item.notes}</div>
                )}
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <label className="block text-sm mb-1">Tip:</label>
            <input
              type="number"
              value={tipInput}
              onChange={(e) => setTipInput(e.target.value)}
              placeholder="0.00"
              className="w-full border rounded px-3 py-1"
            />
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <button
              onClick={handleSplitBill}
              className="w-full bg-purple-600 text-white py-2 rounded shadow hover:bg-purple-700"
            >
              🧮 Split Bill
            </button>
          </div>

          <div className="text-right font-bold text-lg mb-4">
            Total: €{grandTotal.toFixed(2)}
          </div>

          <button
            onClick={() => {
              clearTable(activeTable, tip);
              setTipInput("");
            }}
            className="w-full bg-green-600 text-white py-3 rounded shadow hover:bg-green-700"
          >
            ✅ Paid & Clear Table
          </button>
        </>
      )}

      {/* Edit Popup */}
      {editItemIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-[90%] max-w-sm shadow-lg relative space-y-4">
            <h2 className="text-lg font-bold mb-2">Edit Item</h2>
            <p className="text-sm text-gray-600">
              {orderItems[editItemIndex]?.name}
            </p>

            <label className="block">
              Quantity:
              <input
                type="number"
                min="1"
                value={editQuantity}
                onChange={(e) =>
                  setEditQuantity(parseInt(e.target.value) || 1)
                }
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>

            <div className="flex justify-between gap-2 mt-4">
              <button
                onClick={() => setEditItemIndex(null)}
                className="flex-1 bg-gray-300 rounded py-2 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 bg-red-500 text-white rounded py-2 hover:bg-red-600"
              >
                🗑 Remove
              </button>
              <button
                onClick={handleUpdate}
                className="flex-1 bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Split Bill Modal */}
      {splitMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Split Bill</h2>
            <label className="block mb-2">
              Number of Guests:
              <input
                type="number"
                min="1"
                value={splitCount}
                onChange={(e) => setSplitCount(parseInt(e.target.value) || 1)}
                className="w-full border rounded px-2 py-1"
              />
            </label>

            <div className="text-sm text-gray-600 mb-3">Assign items to guests:</div>
            <ul className="space-y-2 mb-4">
              {orderItems.map((item, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span className="text-sm">
                    {item.name} (x{item.quantity})
                  </span>
                  <select
                    value={assigned[index] ?? ""}
                    onChange={(e) =>
                      setAssigned({ ...assigned, [index]: parseInt(e.target.value) })
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="">-- Guest --</option>
                    {Array.from({ length: splitCount }).map((_, i) => (
                      <option key={i} value={i}>
                        Guest {i + 1}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>

            <div className="text-sm font-medium mb-3">Split Totals:</div>
            <ul className="text-sm space-y-1 mb-4">
              {getSplitSummary().map((amount, i) => (
                <li key={i}>
                  💳 Guest {i + 1}: €{amount.toFixed(2)}
                </li>
              ))}
            </ul>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSplitMode(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
