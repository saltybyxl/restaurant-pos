import { useOrder } from "../context/OrderContext";

export default function OrderDrawer() {
  const { order, dispatch } = useOrder();

  const subtotal = order.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <h2 className="text-lg font-bold mb-2">🧾 Current Order</h2>
      {order.length === 0 ? (
        <p className="text-gray-500">No items yet</p>
      ) : (
        <div className="space-y-2 mb-4">
          {order.map((item) => (
            <div
              key={item.name}
              className="flex justify-between items-center bg-gray-100 rounded p-2"
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  ${item.price.toFixed(2)} x {item.qty}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 bg-gray-300 rounded"
                  onClick={() => dispatch({ type: "DECREASE", name: item.name })}
                >
                  -
                </button>
                <span>{item.qty}</span>
                <button
                  className="px-2 bg-gray-300 rounded"
                  onClick={() => dispatch({ type: "INCREASE", name: item.name })}
                >
                  +
                </button>
                <button
                  className="text-red-500 font-bold ml-2"
                  onClick={() => dispatch({ type: "REMOVE", name: item.name })}
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="text-right font-bold">Total: ${subtotal.toFixed(2)}</div>
      <button
        className="w-full bg-blue-600 text-white py-2 rounded mt-4"
        onClick={() => alert("Order sent to kitchen")}
      >
        Send to Kitchen
      </button>
    </div>
  );
}
