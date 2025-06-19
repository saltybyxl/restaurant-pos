import { useState, useEffect } from "react";
import TablesScreen from "./screens/TablesScreen";
import MenuScreen from "./screens/MenuScreen";
import OrdersScreen from "./screens/OrdersScreen";
import HistoryScreen from "./screens/HistoryScreen";
import MenuEditorScreen from "./screens/MenuEditorScreen";

import { OrderProvider, useOrder } from "./context/OrderContext";
import { MenuProvider } from "./context/MenuContext";

import TabNavigation from "./components/TabNavigation";
import { useSwipeable } from "react-swipeable";

const tabs = ["tables", "menu", "orders", "history", "menueditor"];

function AppContent({ tab, setTab }) {
  const { editMode } = useOrder();

  useEffect(() => {
    if (editMode) {
      document.body.classList.add("edit-mode-locked");
    } else {
      document.body.classList.remove("edit-mode-locked");
    }
  }, [editMode]);

  const currentIndex = tabs.indexOf(tab);
  const handlers = useSwipeable({
    onSwipedLeft: (e) => {
      const isInputFocused = document.activeElement.tagName === "INPUT";
      if (!editMode && !isInputFocused && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (currentIndex < tabs.length - 1) setTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: (e) => {
      const isInputFocused = document.activeElement.tagName === "INPUT";
      if (!editMode && !isInputFocused && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (currentIndex > 0) setTab(tabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="min-h-screen bg-gray-50 pb-24 overflow-hidden">
      <div className="pb-24">
        {tab === "tables" && <TablesScreen onTableSelect={() => setTab("menu")} />}
        {tab === "menu" && <MenuScreen />}
        {tab === "orders" && <OrdersScreen />}
        {tab === "history" && <HistoryScreen />}
        {tab === "menueditor" && <MenuEditorScreen />} {/* ✅ menu editor */}
      </div>
      <TabNavigation tab={tab} setTab={setTab} />
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("tables");

  useEffect(() => {
    const handler = (e) => setTab(e.detail);
    window.addEventListener("setTab", handler);
    return () => window.removeEventListener("setTab", handler);
  }, []);

  return (
    <OrderProvider>
      <MenuProvider>
        <AppContent tab={tab} setTab={setTab} />
      </MenuProvider>
    </OrderProvider>
  );
}

export default App;