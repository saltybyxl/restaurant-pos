import { useOrder } from "../context/OrderContext";
import { useState } from "react";
import { formatKitchenOrder } from "../utils/formatKitchenOrder";

export default function OrdersScreen() {
  const { selectedTable, orders, dispatch } = useOrder();
  const [tip, setTip] = useState("");

  const tableOrder = selectedTable ? orders[selectedTable] || [] : [];

  const handleRemoveItem = (index) => {
    dispatch({ type: "REMOVE_ITEM", table: selectedTable, index });
  };

  const handleClearOrder = () => {
    if (confirm("Clear this order completely?")) {
      dispatch({ type: "CLEAR_ORDER", table: selectedTable });
    }
  };

  const handleSendToKitchen = () => {
  const kitchenItems = tableOrder.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    notes: item.notes,
  }));

  const textToPrint = formatKitchenOrder(selectedTable, kitchenItems);

  console.log("🧾 Kitchen Print Preview:\n" + textToPrint);

  alert("✅ Sent to kitchen (see console)");
};

  const handlePrint = () => {
    alert("🖨️ Print Receipt (not implemented yet)");
  };

  const handleMarkAsPaid = () => {
    if (!selectedTable || tableOrder.length === 0) return;

    const confirmed = confirm("Mark this order as paid?");
    if (!confirmed) return;

    dispatch({
      type: "MARK_AS_PAID",
      table: selectedTable,
      tip: parseFloat(tip) || 0,
    });

    setTip("");
    alert("✅ Order marked as paid and saved to history");
  };

  const total = tableOrder.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 pb-32">
      {!selectedTable ? (
        <div className="text-center text-red-600 font-semibold">
          Please select a table first.
        </div>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4">
            Order for <span className="text-blue-600">{selectedTable}</span>
          </h2>

          {tableOrder.length === 0 ? (
            <div className="text-gray-500 text-center">No items added yet.</div>
          ) : (
            <div className="space-y-4">
              {tableOrder.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded shadow p-3 flex justify-between items-start"
                >
                  <div>
                    <div className="font-semibold">
                      {item.quantity} × {item.name}
                    </div>
                    {item.notes && (
                      <div className="text-sm text-gray-600">
                        Notes: {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemoveItem(idx)}
                      className="text-xs text-red-500 hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tip:
                  </label>
                  <input
                    type="number"
                    placeholder="Optional"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <button
                  onClick={handleSendToKitchen}
                  className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                >
                  Send to Kitchen
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Print Receipt
                </button>
                <button
                  onClick={handleMarkAsPaid}
                  className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  ✅ Mark as Paid
                </button>
                <button
                  onClick={handleClearOrder}
                  className="bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                >
                  Clear Order
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
