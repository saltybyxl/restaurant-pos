import { useState, useRef, useEffect } from "react";
import { useOrder } from "../context/OrderContext";
import { foodMenu } from "../data/foodData";
import { drinksMenu } from "../data/drinksData";

export default function MenuScreen() {
  const { selectedTable, dispatch } = useOrder();
  const [activeTab, setActiveTab] = useState("food");
  const [searchTerm, setSearchTerm] = useState("");
  const [popupItem, setPopupItem] = useState(null);
  const containerRef = useRef(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchTerm]);

  useEffect(() => {
    const combined = [...foodMenu, ...drinksMenu];
    const initialState = Object.fromEntries(
      combined.map((sec) => [sec.category, true])
    );
    setCollapsedSections(initialState);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) return;
    const combined = [...foodMenu, ...drinksMenu];
    const lowerSearch = searchTerm.trim().toLowerCase();
    const autoExpand = {};
    combined.forEach((section) => {
      const hasMatch = section.items.some((item) =>
        item.name.toLowerCase().includes(lowerSearch)
      );
      if (hasMatch) {
        autoExpand[section.category] = false;
      }
    });
    setCollapsedSections((prev) => ({ ...prev, ...autoExpand }));
  }, [searchTerm]);

  const handleAddToOrder = (item, quantity, notes) => {
    if (!selectedTable) return;
    dispatch({
      type: "ADD_ITEM",
      table: selectedTable,
      item: {
        name: item.name,
        price: item.price,
        quantity,
        notes,
      },
    });
  };

  const toggleSection = (category) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getDisplaySections = () => {
    const combined = [...foodMenu, ...drinksMenu];
    const lowerSearch = searchTerm.trim().toLowerCase();
    if (!lowerSearch) {
      return activeTab === "food" ? foodMenu : drinksMenu;
    }
    const matchedSections = combined
      .map((section) => {
        const filteredItems = section.items.filter((item) =>
          item.name.toLowerCase().includes(lowerSearch)
        );
        if (filteredItems.length > 0) {
          return { ...section, items: filteredItems };
        }
        return null;
      })
      .filter(Boolean); // Remove nulls safely

    const uniqueSections = matchedSections.filter(
      (sec, idx, arr) => arr.findIndex((s) => s.category === sec.category) === idx
    );

    return uniqueSections;
  };

  const displaySections = getDisplaySections();

  const renderSection = (section) => {
    const isCollapsed = collapsedSections[section.category];
    return (
      <div key={section.category} className="mb-6">
        <button
          onClick={() => toggleSection(section.category)}
          className="flex justify-between items-center w-full text-left text-lg font-bold mb-2 px-2 py-1 bg-gray-100 rounded"
        >
          {section.category}
          <span>{isCollapsed ? "▼" : "▲"}</span>
        </button>
        {!isCollapsed && (
          <div className="grid grid-cols-2 gap-3">
            {section.items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setPopupItem(item)}
                className="bg-white rounded shadow p-4 text-center hover:bg-blue-100"
              >
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-600">${item.price.toFixed(2)}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="p-4 pb-24 overflow-y-auto h-[calc(100vh-6rem)]">
      {!selectedTable ? (
        <div className="text-center text-red-600 font-semibold">
          Please select a table first.
        </div>
      ) : (
        <div className="text-center text-sm mb-2 text-gray-600">
          ✅ Adding items to <span className="font-medium">{selectedTable}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-4">
        {["food", "drinks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full ${
              activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded"
      />

      {/* Render Sections */}
      {displaySections.map(renderSection)}

      {/* Popup */}
      {popupItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-[90%] max-w-sm shadow-lg relative">
            <h2 className="text-lg font-bold mb-2">{popupItem.name}</h2>
            <p className="text-sm text-gray-600 mb-4">
              ${popupItem.price.toFixed(2)}
            </p>

            <label className="block mb-2">
              Quantity:
              <input
                type="number"
                min="1"
                defaultValue="1"
                id="popup-qty"
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>

            <label className="block mb-4">
              Notes:
              <textarea
                id="popup-notes"
                placeholder="e.g. no onions, extra ice..."
                className="w-full border rounded px-2 py-1 mt-1"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPopupItem(null)}
                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const qty = parseInt(
                    document.getElementById("popup-qty").value
                  );
                  const notes = document.getElementById("popup-notes").value;
                  if (qty > 0) {
                    handleAddToOrder(popupItem, qty, notes);
                    setPopupItem(null);
                  }
                }}
                className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
