import { useOrder } from "../context/OrderContext";

export default function ProductCard({ item }) {
  const { dispatch } = useOrder();

  return (
    <div
      onClick={() => dispatch({ type: "ADD_ITEM", item })}
      className="bg-white rounded-xl shadow p-3 cursor-pointer hover:scale-105 transition flex flex-col items-center text-center"
    >
      <div className="font-medium text-sm">{item.name}</div>
      <div className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)}</div>
    </div>
  );
}
