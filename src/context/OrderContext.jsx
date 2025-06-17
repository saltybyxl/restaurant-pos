import { createContext, useContext, useReducer, useEffect } from "react";

const getInitialState = () => {
  const savedLayout = localStorage.getItem("tableLayout");
  const savedOrders = localStorage.getItem("orders");
  const savedHistory = localStorage.getItem("orderHistory");

  return {
    selectedTable: null,
    activeSection: "restaurant",
    editMode: false,
    tableLayout: savedLayout
      ? JSON.parse(savedLayout)
      : {
          restaurant: [{ id: "r1", name: "Table 1", x: 0, y: 0 }],
          kiosk: [{ id: "k1", name: "Table 101", x: 0, y: 0 }],
          inside: [{ id: "i1", name: "IN1", x: 0, y: 0 }],
        },
    orders: savedOrders ? JSON.parse(savedOrders) : {},
    orderHistory: savedHistory ? JSON.parse(savedHistory) : [],
  };
};

const OrderContext = createContext();

function orderReducer(state, action) {
  switch (action.type) {
    case "SET_SELECTED_TABLE":
      return { ...state, selectedTable: action.table };

    case "SET_SECTION":
      return { ...state, activeSection: action.section };

    case "TOGGLE_EDIT_MODE":
      return { ...state, editMode: !state.editMode };

    case "ADD_TABLE": {
      const section = state.activeSection;
      const newId = `${section}_${Date.now()}`;
      const newName =
        section === "restaurant"
          ? `Table ${state.tableLayout[section].length + 1}`
          : section === "kiosk"
          ? `Table ${100 + state.tableLayout[section].length + 1}`
          : `IN${state.tableLayout[section].length + 1}`;
      const newTable = {
        id: newId,
        name: newName,
        x: 10,
        y: 10,
      };
      return {
        ...state,
        tableLayout: {
          ...state.tableLayout,
          [section]: [...state.tableLayout[section], newTable],
        },
      };
    }

    case "REMOVE_TABLE": {
      const section = state.activeSection;
      const updated = state.tableLayout[section].filter(
        (t) => t.id !== action.id
      );
      return {
        ...state,
        tableLayout: {
          ...state.tableLayout,
          [section]: updated,
        },
      };
    }

    case "RENAME_TABLE": {
      const section = state.activeSection;
      const updated = state.tableLayout[section].map((t) =>
        t.id === action.id ? { ...t, name: action.newName } : t
      );
      return {
        ...state,
        tableLayout: {
          ...state.tableLayout,
          [section]: updated,
        },
      };
    }

    case "MOVE_TABLE": {
      const { id, x, y } = action;
      const section = state.activeSection;
      const updated = state.tableLayout[section].map((t) =>
        t.id === id ? { ...t, x, y } : t
      );
      return {
        ...state,
        tableLayout: {
          ...state.tableLayout,
          [section]: updated,
        },
      };
    }

    // === ORDER ACTIONS ===

    case "ADD_ITEM": {
      const { table, item } = action;
      let existing = state.orders[table];

      // If it's still an array (from old save), upgrade it
      if (!existing || Array.isArray(existing)) {
        existing = {
          items: Array.isArray(existing) ? existing : [],
          tip: 0,
          status: "new",
          startTime: new Date().toISOString(),
        };
      }

      const updated = {
        ...existing,
        items: [...existing.items, item],
        status: "new",
        startTime: existing.startTime || new Date().toISOString(),
      };

      return {
        ...state,
        orders: {
          ...state.orders,
          [table]: updated,
        },
      };
    }

    case "REMOVE_ITEM": {
      const { table, index } = action;
      const existing = state.orders[table];
      if (!existing) return state;

      const newItems = [...existing.items];
      newItems.splice(index, 1);

      return {
        ...state,
        orders: {
          ...state.orders,
          [table]: { ...existing, items: newItems },
        },
      };
    }

    case "CLEAR_ORDER": {
      const { table } = action;
      const updatedOrders = { ...state.orders };
      delete updatedOrders[table];
      return {
        ...state,
        orders: updatedOrders,
      };
    }

    case "SEND_TO_KITCHEN": {
      const { table } = action;
      const current = state.orders[table];
      if (!current) return state;
      return {
        ...state,
        orders: {
          ...state.orders,
          [table]: { ...current, status: "sent" },
        },
      };
    }

    case "MARK_AS_PAID": {
      const { table, tip } = action;
      const current = state.orders[table];
      if (!current) return state;

      const total = current.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const entry = {
        table,
        items: current.items,
        total,
        tip: tip || 0,
        date: new Date().toISOString(),
      };

      const updatedOrders = { ...state.orders };
      delete updatedOrders[table];

      return {
        ...state,
        orders: updatedOrders,
        orderHistory: [entry, ...state.orderHistory],
      };
    }

    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, getInitialState());

  useEffect(() => {
    localStorage.setItem("tableLayout", JSON.stringify(state.tableLayout));
  }, [state.tableLayout]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(state.orders));
  }, [state.orders]);

  useEffect(() => {
    localStorage.setItem("orderHistory", JSON.stringify(state.orderHistory));
  }, [state.orderHistory]);

  return (
    <OrderContext.Provider value={{ ...state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => useContext(OrderContext);
