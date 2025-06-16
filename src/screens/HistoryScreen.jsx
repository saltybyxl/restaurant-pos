import { useOrder } from "../context/OrderContext";

export default function HistoryScreen() {
  const { orderHistory } = useOrder();

  const totalRevenue = orderHistory.reduce(
    (sum, entry) => sum + entry.total,
    0
  );
  const totalTips = orderHistory.reduce((sum, entry) => sum + (entry.tip || 0), 0);

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-bold mb-4">Order History</h2>

      {orderHistory.length === 0 ? (
        <div className="text-gray-500 text-center">No orders paid yet.</div>
      ) : (
        <>
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
                  Items:{" "}
                  {entry.items.map((item, idx) => (
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

          <div className="border-t pt-4 font-bold text-md space-y-1">
            <div>Total Revenue: ${totalRevenue.toFixed(2)}</div>
            <div>Total Tips: ${totalTips.toFixed(2)}</div>
          </div>
        </>
      )}
    </div>
  );
}
