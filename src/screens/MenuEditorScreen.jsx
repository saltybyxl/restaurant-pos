import { useState } from "react";
import { useMenu } from "../context/MenuContext";

export default function MenuEditorScreen() {
  const { menu, addItem, updateItem, deleteItem } = useMenu();
  const [type, setType] = useState("food");
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });

  const handleAdd = () => {
    if (!newItem.name || !newItem.price || !newItem.category) return;
    addItem(type, { ...newItem, price: parseFloat(newItem.price) });
    setNewItem({ name: "", price: "", category: "" });
  };

  return (
    <div className="p-4 pb-24">
      <h2 className="text-lg font-bold mb-4">📋 Menu Editor</h2>

      <div className="mb-4">
        <label className="mr-2">Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} className="border px-2 py-1 rounded">
          <option value="food">Food</option>
          <option value="drinks">Drinks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        <input
          className="border rounded px-2 py-1"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Price"
          type="number"
          step="0.01"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
        />
        <input
          className="border rounded px-2 py-1 col-span-2"
          placeholder="Category"
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
        />
        <button onClick={handleAdd} className="col-span-2 bg-green-600 text-white py-2 rounded shadow hover:bg-green-700">
          ➕ Add Item
        </button>
      </div>

      <div className="space-y-4">
        {menu[type].map((item, index) => (
          <div key={index} className="bg-white p-3 rounded shadow text-sm space-y-1">
            <div><strong>{item.name}</strong> - ${item.price.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Category: {item.category}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  const name = prompt("New name:", item.name);
                  const price = prompt("New price:", item.price);
                  const category = prompt("New category:", item.category);
                  if (name && price && category) {
                    updateItem(type, index, {
                      name,
                      price: parseFloat(price),
                      category,
                    });
                  }
                }}
                className="bg-yellow-400 text-white px-3 py-1 rounded text-xs"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this item?")) deleteItem(type, index);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded text-xs"
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
